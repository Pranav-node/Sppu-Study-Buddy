import os
import win32com.client

ppt_path = os.path.abspath(r'd:\B.E final year project\B.E. Project Topic Finalisation Review Template.pptx')
out_dir = os.path.abspath(r'd:\B.E final year project\slides_preview')
os.makedirs(out_dir, exist_ok=True)

ppt = win32com.client.Dispatch('PowerPoint.Application')
prs = ppt.Presentations.Open(ppt_path, WithWindow=False)

for i, slide in enumerate(prs.Slides):
    slide_path = os.path.join(out_dir, f'slide_{i+1}.png')
    slide.Export(slide_path, 'PNG', 1920, 1080)
    print(f"Exported slide {i+1} to {slide_path}")

prs.Close()
ppt.Quit()
