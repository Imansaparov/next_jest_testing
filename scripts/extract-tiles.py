"""Cut tile artwork and UI icons out of the design mockups.

* tile designs  -> src/entities/tile/assets/<id>.png (+ <id>-emblem.png)
* payment icons -> src/features/checkout/assets/*.png
* hero artwork  -> src/shared/assets/decor/hero-*.png

Usage:  python scripts/extract-tiles.py   (requires Pillow)
"""

from __future__ import annotations

import importlib.util
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

# Re-use the background removal from extract-decor.py.
_spec = importlib.util.spec_from_file_location(
    "extract_decor", ROOT / "scripts" / "extract-decor.py"
)
decor = importlib.util.module_from_spec(_spec)
assert _spec.loader
_spec.loader.exec_module(decor)

Box = tuple[int, int, int, int]


def content_box(img: Image.Image, box: Box, tolerance: float = 30) -> Box:
    """Tighten `box` to the pixels that differ from the paper background."""
    x0, y0, x1, y1 = box
    px = img.load()
    xs, ys = [], []
    for y in range(y0, y1):
        for x in range(x0, x1):
            if decor.dist(px[x, y][:3], decor.PAPER) > tolerance:
                xs.append(x)
                ys.append(y)
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def inset(box: Box, amount: int) -> Box:
    x0, y0, x1, y1 = box
    return x0 + amount, y0 + amount, x1 - amount, y1 - amount


def cut_on(img: Image.Image, box: Box, background: tuple[int, int, int]):
    """`decor.cut` for art sitting on a non-paper background."""
    saved = decor.PAPER
    decor.PAPER = background
    try:
        return decor.cut(img, box)
    finally:
        decor.PAPER = saved


SELECTED_CELL = (234, 223, 195)
BUTTON = (233, 222, 196)


def main() -> None:
    desktop = Image.open(ROOT / "design" / "design_desktop.png").convert("RGB")
    mobile = Image.open(ROOT / "design" / "design_mobile.png").convert("RGB")

    tiles_dir = ROOT / "src" / "entities" / "tile" / "assets"
    icons_dir = ROOT / "src" / "features" / "checkout" / "assets"
    decor_dir = ROOT / "src" / "shared" / "assets" / "decor"
    for directory in (tiles_dir, icons_dir, decor_dir):
        directory.mkdir(parents=True, exist_ok=True)

    tiles: dict[str, Image.Image] = {}

    # Cart products — mobile mockup (@2×): emblem column and item column.
    for row, design in enumerate(
        ["ocean-wave", "forest-fern", "terracotta-dot", "yellow-star"]
    ):
        top = 446 + row * 112
        emblem = content_box(mobile, (100, top + 4, 188, top + 76))
        tiles[f"{design}-emblem"] = mobile.crop(inset(emblem, 3))
        pattern = content_box(mobile, (240, top + 4, 364, top + 102))
        tiles[design] = mobile.crop(pattern)

    # Design palette — desktop mockup, tile interiors (border drawn in CSS).
    palette_columns = [(878, 926), (939, 987)]
    palette_rows = [(237, 288), (301, 351), (364, 415), (428, 479), (492, 543)]
    palette_ids = [
        ("terracotta-floral", "navy-compass"),
        ("fern-medallion", "saffron-bloom"),
        ("indigo-cross", "golden-herringbone"),
        ("sage-chevron", "azure-swallow"),
        ("terracotta-arch", "indigo-dove"),
    ]
    for (y0, y1), pair in zip(palette_rows, palette_ids):
        for (x0, x1), design in zip(palette_columns, pair):
            tiles[design] = desktop.crop((x0, y0, x1, y1))

    # Design grid — every tile exactly as painted in the mockup's grid cells
    # (`*-grid.png`). Designs that only exist on the grid get a plain name.
    grid_columns = [(482, 531), (533, 583), (585, 635), (637, 686)]
    grid_rows = [(260, 314), (316, 372), (373, 428), (430, 486), (487, 540)]
    grid_art = {
        (0, 0): "mustard-arc",
        (0, 1): "indigo-arc",
        (0, 2): "amber-compass",
        (0, 3): "terracotta-compass",
        (1, 0): "indigo-quarter",
        (1, 1): "terracotta-dot-grid",
        (1, 2): "saffron-flake",
        (2, 0): "terracotta-dot-b",
        (2, 1): "forest-fern-grid",
        (2, 2): "fern-star",
        (3, 1): "terracotta-dot-c",
        (3, 3): "ocean-wave-grid",
        (4, 3): "yellow-star-grid",
    }
    for (row, column), name in grid_art.items():
        x0, x1 = grid_columns[column]
        y0, y1 = grid_rows[row]
        tiles[name] = desktop.crop((x0, y0, x1, y1))

    # Cart on the desktop mockup (1×): emblem + item swatch per row.
    for row, design in enumerate(
        ["ocean-wave", "forest-fern", "terracotta-dot", "yellow-star"]
    ):
        top = [224, 290, 357, 425][row]
        emblem = content_box(desktop, (88, top + 2, 154, top + 47))
        tiles[f"{design}-emblem-desktop"] = desktop.crop(inset(emblem, 2))
        pattern = content_box(desktop, (176, top + 3, 245, top + 64))
        tiles[f"{design}-desktop"] = desktop.crop(pattern)

    for name, image in tiles.items():
        image.save(tiles_dir / f"{name}.png", optimize=True)

    # Payment method icons.
    icons = {
        # mobile strip (@2×)
        "card": (110, 1068, 190, 1126),
        "paypal": content_box(mobile, (262, 1062, 376, 1127)),
        "apple-pay": content_box(mobile, (425, 1062, 540, 1130)),
        "bank": content_box(mobile, (590, 1062, 700, 1127)),
    }
    for name, box in icons.items():
        # the credit-card cell is the selected one, with a beige background
        image = (
            cut_on(mobile, box, SELECTED_CELL)
            if name == "card"
            else decor.cut(mobile, box)
        )
        image.save(icons_dir / f"{name}.png", optimize=True)
    desktop_icons = {
        "paypal-small": content_box(desktop, (1206, 404, 1231, 432)),
        "card-brands": content_box(desktop, (1056, 446, 1152, 477)),
        "apple-pay-large": content_box(desktop, (1052, 574, 1140, 614)),
        "bank-large": content_box(desktop, (1206, 570, 1268, 612)),
    }
    for name, box in desktop_icons.items():
        decor.cut(desktop, box).save(icons_dir / f"{name}.png", optimize=True)

    # Cart action icons and the tile inside "Add new tile" (mobile @2×).
    cart_icons = {
        "action-add": content_box(mobile, (606, 466, 661, 512)),
        "action-remove": content_box(mobile, (661, 466, 702, 512)),
        "add-tile-swatch": content_box(mobile, (248, 903, 290, 948)),
    }
    for name, box in cart_icons.items():
        # the swatch sits on the button's beige background
        image = (
            cut_on(mobile, box, BUTTON)
            if name == "add-tile-swatch"
            else decor.cut(mobile, box)
        )
        image.save(decor_dir / f"{name}.png", optimize=True)

    # Hero: museum & kiln (desktop), tile strips (mobile @2× and desktop 1×).
    hero = {
        "hero-museum": decor.cut(desktop, content_box(desktop, (380, 46, 452, 130))),
        "hero-kiln": decor.cut(desktop, content_box(desktop, (922, 48, 987, 130))),
        "hero-tiles-left": decor.cut(mobile, content_box(mobile, (56, 128, 240, 192))),
        "hero-tiles-right": decor.cut(mobile, content_box(mobile, (530, 128, 716, 192))),
        "hero-tiles-left-desktop": decor.cut(desktop, content_box(desktop, (466, 90, 584, 132))),
        "hero-tiles-right-desktop": decor.cut(desktop, content_box(desktop, (790, 90, 910, 132))),
    }
    for name, image in hero.items():
        image.save(decor_dir / f"{name}.png", optimize=True)

    for directory in (tiles_dir, icons_dir):
        for file in sorted(directory.glob("*.png")):
            with Image.open(file) as image:
                print(f"{file.relative_to(ROOT)}: {image.size[0]}x{image.size[1]}")


if __name__ == "__main__":
    main()
