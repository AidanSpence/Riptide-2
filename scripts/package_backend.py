"""build an allowlisted EB zip without local credentials or generated files."""
import argparse
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

root = Path(__file__).resolve().parents[1] / "Django"
parser = argparse.ArgumentParser()
parser.add_argument("output", type=Path)
args = parser.parse_args()
args.output.parent.mkdir(parents=True, exist_ok=True)
files = ["Dockerfile", "start.sh", "manage.py", "requirements.txt", "data/clean_merged.csv"]
for folder in ("config", "Riptide2", ".platform", ".ebextensions"):
    files += [str(path.relative_to(root)) for path in (root / folder).rglob("*") if path.is_file()]
with ZipFile(args.output, "w", ZIP_DEFLATED) as archive:
    for name in sorted(set(files)):
        path = Path(name)
        if "__pycache__" in path.parts or path.suffix == ".pyc" or path.name.startswith(".env"):
            continue
        archive.write(root / path, name)
print(f"created {args.output}")
