import argparse
import csv
import re
import sys

GUESS = {"title", "song", "name", "track", "track name", "artist", "artists"}


def pick_files():
    """Open a file picker to choose CSVs to upload."""
    import tkinter as tk
    from tkinter import filedialog

    root = tk.Tk()
    root.withdraw()
    paths = filedialog.askopenfilenames(
        title="Choose song CSV files", filetypes=[("CSV files", "*.csv")]
    )
    root.destroy()
    return list(paths)


def read_csv(path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            raise ValueError("no header row")
        headers = [h.strip() for h in reader.fieldnames]
        rows = [
            {h.strip(): (v or "") for h, v in row.items() if h is not None}
            for row in reader
        ]
    return headers, rows


def normalize(value):
    return re.sub(r"\s+", " ", value.strip()).lower()


def main():
    ap = argparse.ArgumentParser(description="Merge song CSVs and remove duplicates.")
    ap.add_argument("files", nargs="*", help="CSV files to merge")
    ap.add_argument("-o", "--output", default="merged.csv", help="output file name")
    ap.add_argument("-k", "--keys", nargs="+", help="columns that define a duplicate")
    args = ap.parse_args()

    paths = args.files or pick_files()
    if not paths:
        sys.exit("No files chosen.")

    # Read every file; combine headers in first-seen order (case-insensitive).
    headers, seen_headers, all_rows = [], set(), []
    for path in paths:
        try:
            file_headers, rows = read_csv(path)
        except (OSError, ValueError, csv.Error) as e:
            print(f"Skipping {path}: {e}")
            continue
        for h in file_headers:
            if h.lower() not in seen_headers:
                seen_headers.add(h.lower())
                headers.append(h)
        # Store rows keyed by lowercase header so differently-cased columns line up.
        all_rows.extend({k.lower(): v for k, v in r.items()} for r in rows)
        print(f"Read {len(rows)} rows from {path}")

    if not all_rows:
        sys.exit("No rows found.")

    # Decide which columns define a duplicate.
    if args.keys:
        keys = [k.lower() for k in args.keys]
        missing = [k for k in keys if k not in seen_headers]
        if missing:
            sys.exit(f"Column(s) not found: {', '.join(missing)}. Available: {', '.join(headers)}")
    else:
        keys = [h.lower() for h in headers if h.lower() in GUESS] or [h.lower() for h in headers]
    print("Duplicate check uses:", ", ".join(keys))

    # Keep the first copy of each song.
    seen, merged = set(), []
    for row in all_rows:
        key = tuple(normalize(row.get(k, "")) for k in keys)
        if key not in seen:
            seen.add(key)
            merged.append(row)

    with open(args.output, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for row in merged:
            writer.writerow([row.get(h.lower(), "") for h in headers])

    removed = len(all_rows) - len(merged)
    print(f"\n{len(all_rows)} rows in, {removed} duplicates removed, {len(merged)} rows out.")
    print(f"Saved to {args.output}")


if __name__ == "__main__":
    main()