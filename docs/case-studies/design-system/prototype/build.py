"""Builds docs/design/case-design-system.html from the site's shared CSS and this folder's parts.

Run from the repo root:  python3 docs/case-studies/design-system/prototype/build.py
The shared tokens.css and case-file.css are inlined verbatim, so the prototype matches the live template.
"""
import pathlib

root = pathlib.Path(__file__).resolve().parents[4]
here = pathlib.Path(__file__).resolve().parent
out = root / "docs/design/case-design-system.html"

head = """<title>One Design System, Three Products</title>
<meta name="description" content="Prototype of the design-system case file: a theme panel, colour scales and the cards, on an invented brand.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap">
"""
css = "\n".join(
    [
        "/* ===== shared: src/app/tokens.css (verbatim) ===== */",
        (root / "src/app/tokens.css").read_text(),
        "/* ===== shared: src/app/case-file.css (verbatim) ===== */",
        (root / "src/app/case-file.css").read_text(),
        "/* ===== project: design-system ===== */",
        (here / "ds.css").read_text(),
    ]
)
html = head + "<style>\n" + css + "\n</style>\n" + (here / "body.html").read_text() + "\n<script>\n" + (here / "ds.js").read_text() + "\n</script>\n"
import base64
img = root / "public/assets/design-system/figma-components.webp"
html = html.replace("{{FIGMA_COMPONENTS}}", "data:image/webp;base64," + base64.b64encode(img.read_bytes()).decode())
out.write_text(html)
print(out, len(html), "bytes")
