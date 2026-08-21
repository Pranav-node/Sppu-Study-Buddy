import os
import win32com.client

ppt_path = os.path.abspath(r'd:\B.E final year project\B.E. Project Topic Finalisation Review Template.pptx')
ppt = win32com.client.Dispatch('PowerPoint.Application')
prs = ppt.Presentations.Open(ppt_path, WithWindow=False)

print(f"Total slides: {prs.Slides.Count}")
for s_idx in range(1, prs.Slides.Count + 1):
    slide = prs.Slides(s_idx)
    print(f"\n--- SLIDE {s_idx} ---")
    for shp_idx in range(1, slide.Shapes.Count + 1):
        shp = slide.Shapes(shp_idx)
        has_txt = shp.HasTextFrame
        txt = shp.TextFrame.TextRange.Text.replace('\n', '\\n') if has_txt else "N/A"
        print(f"  Shape {shp_idx}: Name='{shp.Name}', Type={shp.Type}, Left={shp.Left:.1f}, Top={shp.Top:.1f}, Width={shp.Width:.1f}, Height={shp.Height:.1f}")
        if has_txt:
            print(f"    Text: \"{txt}\"")

prs.Close()
ppt.Quit()
