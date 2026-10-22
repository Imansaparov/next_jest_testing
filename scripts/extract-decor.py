"""Cut the decorative illustrations out of the design mockups.

The hand-drawn art (hands, plants, edge tiles) cannot be reproduced exactly
in code, so it is taken straight from ``design/*.png`` and saved as
transparent PNGs in ``src/shared/assets/decor``.

Usage:  python scripts/extract-decor.py
Requires Pillow.
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "shared" / "assets" / "decor"

PAPER = (247, 244, 227)
CELL = (223, 212, 184)

Box = tuple[int, int, int, int]


def dist(a: tuple[int, ...], b: tuple[int, ...]) -> float:
    return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5


def flood(
    width: int,
    height: int,
    passable,
    seeds,
) -> set[tuple[int, int]]:
    seen: set[tuple[int, int]] = set()
    queue = deque(p for p in seeds if passable(*p))
    seen.update(queue)
    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in seen:
                if passable(nx, ny):
                    seen.add((nx, ny))
                    queue.append((nx, ny))
    return seen


def border(width: int, height: int):
    for x in range(width):
        yield x, 0
        yield x, height - 1
    for y in range(height):
        yield 0, y
        yield width - 1, y


def to_rgba(img: Image.Image, clear: set[tuple[int, int]]) -> Image.Image:
    """Make `clear` transparent and soften the anti-aliased fringe."""
    rgba = img.convert("RGBA")
    px = rgba.load()
    width, height = rgba.size
    for x, y in clear:
        px[x, y] = (*PAPER, 0)
    # Fringe: pixels next to the cleared area fade by how paper-like they are.
    for y in range(height):
        for x in range(width):
            if (x, y) in clear:
                continue
            near = any(
                (x + dx, y + dy) in clear
                for dx in (-1, 0, 1)
                for dy in (-1, 0, 1)
            )
            if near:
                r, g, b, _ = px[x, y]
                d = min(dist((r, g, b), PAPER), dist((r, g, b), CELL))
                alpha = max(0, min(255, int((d - 8) / 50 * 255)))
                px[x, y] = (r, g, b, alpha)
    return rgba


def despeckle(clear: set[tuple[int, int]], width: int, height: int, rounds=2):
    for _ in range(rounds):
        extra = set()
        for y in range(height):
            for x in range(width):
                if (x, y) in clear:
                    continue
                around = sum(
                    (x + dx, y + dy) in clear
                    or not (0 <= x + dx < width and 0 <= y + dy < height)
                    for dx in (-1, 0, 1)
                    for dy in (-1, 0, 1)
                    if dx or dy
                )
                if around >= 6:
                    extra.add((x, y))
        clear |= extra
    return clear


def cut(source: Image.Image, box: Box, tolerance: float = 24) -> Image.Image:
    """Remove the paper background connected to the crop border."""
    crop = source.crop(box).convert("RGB")
    width, height = crop.size
    px = crop.load()

    def passable(x: int, y: int) -> bool:
        return dist(px[x, y], PAPER) < tolerance

    clear = flood(width, height, passable, border(width, height))
    return to_rgba(crop, despeckle(clear, width, height))


def cut_grid_hand(source: Image.Image) -> Image.Image:
    """The hand dragging a tile over the design grid (desktop mockup).

    The hand is filled with paper colour, so only paper *outside* the hand is
    removed; the grid's beige cells and lines underneath are removed too.
    """
    x0, y0, x1, y1 = 711, 438, 908, 668
    crop = source.crop((x0, y0, x1, y1)).convert("RGB")
    width, height = crop.size
    px = crop.load()

    grid_x = {737, 738, 789, 790, 791, 844, 845, 866, 867}
    grid_y = {428, 429, 486, 540, 541, 594, 620}

    def on_grid(x: int, y: int) -> bool:
        ax, ay = x + x0, y + y0
        return any(abs(ax - g) <= 1 for g in grid_x) or any(
            abs(ay - g) <= 1 for g in grid_y
        )

    def is_paper(x: int, y: int) -> bool:
        return dist(px[x, y], PAPER) < 18

    # The sketched arm is open at the bottom, between the ends of its two
    # contour lines. Close that gap so outside paper cannot flood the hand.
    left_end, right_end = (858, 662), (905, 635)
    slope = (right_end[1] - left_end[1]) / (right_end[0] - left_end[0])

    def cut_line(ax: int) -> float:
        return left_end[1] + (ax - left_end[0]) * slope

    def blocked(x: int, y: int) -> bool:
        ax, ay = x + x0, y + y0
        return ax >= left_end[0] - 4 and ay >= cut_line(ax) - 1

    outside = flood(
        width,
        height,
        lambda x, y: is_paper(x, y) and not blocked(x, y),
        border(width, height),
    )

    clear = set(outside)
    for y in range(height):
        for x in range(width):
            ax, ay = x + x0, y + y0
            # beige cells / palette panel, the palette tiles above the arm and
            # everything beyond the arm's cut line
            if (
                dist(px[x, y], CELL) < 26
                or (ax >= 874 and ay <= 548)
                or (ax >= left_end[0] - 4 and ay >= cut_line(ax) + 2)
            ):
                clear.add((x, y))

    # Grid lines: only dark (or beige-tinted) pixels on a line coordinate that
    # touch already-cleared background — never the paper fill of the hand.
    base = set(clear)
    for y in range(height):
        for x in range(width):
            if (x, y) in base or not on_grid(x, y) or is_paper(x, y):
                continue
            if any(
                (x + dx, y + dy) in base
                for dx in (-2, -1, 0, 1, 2)
                for dy in (-2, -1, 0, 1, 2)
            ):
                clear.add((x, y))
    # fade the arm out where it was cut off
    rgba = to_rgba(crop, despeckle(clear, width, height))
    rpx = rgba.load()
    for y in range(height):
        for x in range(width):
            ax, ay = x + x0, y + y0
            gap = cut_line(ax) - ay
            if ax >= left_end[0] - 30 and gap < 24:
                r, g, b, a = rpx[x, y]
                rpx[x, y] = (r, g, b, int(a * max(0.0, min(1.0, gap / 24))))
    return rgba


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    desktop = Image.open(ROOT / "design" / "design_desktop.png")
    mobile = Image.open(ROOT / "design" / "design_mobile.png")

    pieces: dict[str, Image.Image] = {
        # desktop frame (1 px in the mockup = 1 px in the 1376 px frame)
        "desktop-top-left": cut(desktop, (3, 37, 292, 140)),
        "desktop-top-right": cut(desktop, (1095, 37, 1374, 146)),
        "desktop-left-upper": cut(desktop, (3, 140, 64, 420)),
        "desktop-left-middle": cut(desktop, (3, 300, 64, 420)),
        "desktop-left-fill-a": cut(desktop, (3, 150, 64, 300)),
        "desktop-left-fill-b": cut(desktop, (3, 430, 64, 600)),
        "desktop-left-lower": cut(desktop, (3, 420, 64, 626)),
        "desktop-right-upper": cut(desktop, (1318, 146, 1374, 420)),
        "desktop-right-middle": cut(desktop, (1318, 300, 1374, 420)),
        "desktop-right-fill-a": cut(desktop, (1318, 150, 1374, 300)),
        "desktop-right-fill-b": cut(desktop, (1318, 430, 1374, 600)),
        "desktop-right-lower": cut(desktop, (1318, 420, 1374, 694)),
        # tablet: just the corner tiles, the full top pieces would hit the title
        "desktop-corner-left": cut(desktop, (3, 37, 50, 135)),
        "desktop-corner-right": cut(desktop, (1334, 37, 1374, 146)),
        "desktop-bottom-left": cut(desktop, (3, 626, 494, 766)),
        "desktop-palette-hand": cut(desktop, (893, 645, 1013, 766)),
        "desktop-bottom-right": cut(desktop, (1013, 694, 1374, 766)),
        "desktop-cart-hand": cut(desktop, (70, 492, 160, 560)),
        "desktop-grid-hand": cut_grid_hand(desktop),
        # mobile (mockup is drawn at 2×)
        "mobile-top-left": cut(mobile, (0, 63, 52, 210)),
        "mobile-top-right": cut(mobile, (720, 63, 768, 214)),
        "mobile-notes-tiles": cut(mobile, (10, 1182, 56, 1276)),
        "mobile-bottom-left": cut(mobile, (0, 1274, 300, 1371)),
        "mobile-bottom-middle": cut(mobile, (300, 1294, 592, 1371)),
        "mobile-sprig": cut(mobile, (712, 1128, 768, 1186)),
        "mobile-hands": cut(mobile, (586, 1184, 768, 1371)),
        "mobile-cart-hand": cut(mobile, (60, 892, 212, 998)),
    }

    for name, image in pieces.items():
        image.save(OUT / f"{name}.png", optimize=True)
        print(f"{name}: {image.size[0]}x{image.size[1]}")


if __name__ == "__main__":
    main()
