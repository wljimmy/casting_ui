#!/usr/bin/env python3
"""
中国县级以上行政区划数据抓取工具
数据来源：国家地名信息库 (https://dmfw.mca.gov.cn/)
接口：行政区划搜索 /9095/xzqh/getList

功能：
  1. 单次 API 调用获取省级、地级、县级完整树形数据
  2. 保存原始元数据（完整树形结构）
  3. 保存扁平化 JSON 和 CSV 两种格式
  4. 更新前通过哈希对比数据是否有变化
  5. 有变化时备份旧数据再更新
  6. 记录更新日志
"""

import requests
import json
import csv
import shutil
import hashlib
import sys
from datetime import datetime
from pathlib import Path

# ============================================================
# 配置区
# ============================================================
DATA_DIR = Path(__file__).parent.resolve()
RAW_SOURCE_FILE = DATA_DIR / "administrative_divisions_raw.json"  # 原始树形元数据
FLAT_FILE = DATA_DIR / "administrative_divisions.json"            # 扁平化 JSON
CSV_FILE = DATA_DIR / "administrative_divisions.csv"             # CSV 表格
BACKUP_DIR = DATA_DIR / "backups"
LOG_FILE = DATA_DIR / "update_log.md"

API_BASE = "https://dmfw.mca.gov.cn/9095/xzqh/getList"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Referer": "https://dmfw.mca.gov.cn/",
}

REQUEST_TIMEOUT = 30


# ============================================================
# API 交互 — 单次获取全部数据
# ============================================================
def fetch_all():
    """一次性获取全部县级以上行政区划树形数据（maxLevel=3）"""
    params = {"maxLevel": 3}
    resp = requests.get(
        API_BASE, params=params, headers=HEADERS, timeout=REQUEST_TIMEOUT
    )
    resp.raise_for_status()
    body = resp.json()
    if body.get("status") != 200:
        raise RuntimeError(f"API 返回异常: {body.get('message', '未知错误')}")
    return body["data"]


# ============================================================
# 数据扁平化
# ============================================================
def flatten_node(node, ancestor_chain=None):
    """
    将树形节点递归展开为平铺记录列表。
    ancestor_chain: 从根到父级的节点列表，用于填充 parent/province/city 信息。
    """
    if ancestor_chain is None:
        ancestor_chain = []

    children = node.get("children") or []
    record = {
        "code": node["code"],
        "name": node["name"],
        "level": node["level"],
        "type": node.get("type", ""),
        "parent_code": ancestor_chain[-1]["code"] if ancestor_chain else "",
        "parent_name": ancestor_chain[-1]["name"] if ancestor_chain else "",
    }

    # 提取上级信息（最多到省级）
    level_tags = {1: ("province_code", "province_name"),
                  2: ("city_code", "city_name")}
    for lv in (1, 2):
        key_code, key_name = level_tags[lv]
        target = next(
            (a for a in ancestor_chain if a["level"] == lv),
            None,
        )
        record[key_code] = target["code"] if target else ""
        record[key_name] = target["name"] if target else ""

    results = [record]
    for child in children:
        results.extend(flatten_node(child, ancestor_chain + [node]))
    return results


def collect_all(data):
    """从根节点数据中提取所有省级->地级->县级扁平记录"""
    root_children = data.get("children") or []
    all_records = []
    for child in root_children:
        records = flatten_node(child)
        all_records.extend(records)
    return all_records


# ============================================================
# 数据持久化
# ============================================================
def compute_hash(records):
    """计算数据的 MD5 哈希，用于比对是否有变化"""
    raw = json.dumps(records, ensure_ascii=False, sort_keys=True)
    return hashlib.md5(raw.encode("utf-8")).hexdigest()


def save_json(data, path):
    """保存 JSON 文件"""
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def save_csv(records, path):
    """保存 CSV 文件（含 BOM 头，兼容 Excel）"""
    fields = [
        "code", "name", "level", "type",
        "parent_code", "parent_name",
        "province_code", "province_name",
        "city_code", "city_name",
    ]
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(records)


def backup_existing():
    """备份当前的数据文件"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    backed_up = []
    for src in (RAW_SOURCE_FILE, FLAT_FILE, CSV_FILE):
        if src.exists():
            dst = BACKUP_DIR / f"{src.stem}_{timestamp}{src.suffix}"
            shutil.copy2(src, dst)
            backed_up.append(dst.name)
    return backed_up


# ============================================================
# 更新日志
# ============================================================
def append_log(message):
    """向更新日志追加一条记录"""
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"- **{now}** — {message}\n"

    if LOG_FILE.exists():
        content = LOG_FILE.read_text(encoding="utf-8")
        lines = content.splitlines(keepends=True)
        insert_at = len(lines)
        for i, line in enumerate(lines):
            if line.startswith("- **"):
                insert_at = i
                break
        lines.insert(insert_at, entry)
        LOG_FILE.write_text("".join(lines), encoding="utf-8")
    else:
        LOG_FILE.write_text(
            f"# 行政区划数据更新日志\n\n{entry}", encoding="utf-8"
        )


# ============================================================
# 主流程
# ============================================================
def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 50)
    print("  国家地名信息库 — 行政区划数据抓取")
    print("=" * 50)
    print()

    # ---- 1. 单次抓取全部数据 ----
    print("▶ 正在从 API 获取数据（单次请求 maxLevel=3）…")
    raw_data = fetch_all()
    if not raw_data.get("children"):
        print("✗ 未获取到任何数据，终止。")
        sys.exit(1)

    root_children = raw_data.get("children", [])
    print(f"▶ 原始数据获取成功，共 {len(root_children)} 个省级节点")

    # ---- 2. 扁平化 ----
    records = collect_all(raw_data)
    # 过滤出县级以上层级（level 1=省, 2=地, 3=县）
    filtered = [r for r in records if r["level"] in (1, 2, 3)]
    # 去除非正式区划（如 "资料暂缺" 的台湾省）
    filtered = [r for r in filtered if r["code"] != "资料暂缺"]
    print(f"▶ 扁平化后共 {len(records)} 条记录（县级以上 {len(filtered)} 条）")

    # ---- 3. 数据对比 ----
    new_hash = compute_hash(filtered)
    old_hash = None
    if FLAT_FILE.exists():
        try:
            old_data = json.loads(FLAT_FILE.read_text(encoding="utf-8"))
            old_hash = compute_hash(old_data)
        except Exception:
            old_hash = None

    has_changed = (old_hash != new_hash)

    if not has_changed:
        # 数据未变化，但原始元数据文件可能不存在（首次建立）
        if not RAW_SOURCE_FILE.exists():
            save_json(raw_data, RAW_SOURCE_FILE)
            print(f"▶ 原始元数据已保存（首次建立）: {RAW_SOURCE_FILE}")
        print("▶ 数据无变化，跳过更新。")
        append_log("数据无变化，跳过更新")
        return

    # ---- 4. 备份旧文件 ----
    backed_up = backup_existing() if FLAT_FILE.exists() else []
    if backed_up:
        print(f"▶ 已备份旧文件: {', '.join(backed_up)}")

    # ---- 5. 写入新文件 ----
    # 5a. 保存原始元数据（完整树形结构）
    save_json(raw_data, RAW_SOURCE_FILE)
    print(f"▶ 原始元数据已保存: {RAW_SOURCE_FILE}")

    # 5b. 保存扁平化 JSON
    save_json(filtered, FLAT_FILE)
    print(f"▶ 扁平化 JSON 已保存: {FLAT_FILE}")

    # 5c. 保存 CSV
    save_csv(filtered, CSV_FILE)
    print(f"▶ CSV 表格已保存: {CSV_FILE}")

    # ---- 6. 记录日志 ----
    lv_count = {1: 0, 2: 0, 3: 0}
    for r in filtered:
        lv_count[r["level"]] = lv_count.get(r["level"], 0) + 1

    log_msg = (
        f"数据更新成功  —  "
        f"省级 {lv_count[1]} / "
        f"地级 {lv_count[2]} / "
        f"县级 {lv_count[3]}  |  "
        f"共 {len(filtered)} 条"
    )
    append_log(log_msg)
    print(f"▶ 更新日志已记录")

    # ---- 7. 摘要 ----
    print()
    print("=" * 50)
    print("  ✅ 完成")
    print(f"  原始元数据: {RAW_SOURCE_FILE}")
    print(f"  扁平化 JSON: {FLAT_FILE}")
    print(f"  CSV 表格: {CSV_FILE}")
    print(f"  备份目录: {BACKUP_DIR}/")
    print(f"  更新日志: {LOG_FILE}")
    print("=" * 50)


if __name__ == "__main__":
    main()