import os
import win32com.client

ppt_path = os.path.abspath(r'd:\B.E final year project\B.E. Project Topic Finalisation Review Template.pptx')
ppt = win32com.client.Dispatch('PowerPoint.Application')
prs = ppt.Presentations.Open(ppt_path, WithWindow=False)

print(f"Original slides count: {prs.Slides.Count}")
# Duplicate Slide 2
dup_slide = prs.Slides(2).Duplicate()
print(f"New slides count after duplicate: {prs.Slides.Count}")

prs.Save()
prs.Close()
ppt.Quit()
