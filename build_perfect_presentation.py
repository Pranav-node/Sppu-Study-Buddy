import os
import sys
import win32com.client

def com_rgb(r, g, b):
    return r + (g * 256) + (b * 65536)

COLOR_RED = com_rgb(192, 0, 0)        # #C00000
COLOR_NAVY = com_rgb(0, 32, 96)       # #002060
COLOR_MAGENTA = com_rgb(204, 0, 102)  # #CC0066
COLOR_PURPLE = com_rgb(102, 0, 204)   # #6600CC
COLOR_DARK_RED = com_rgb(153, 0, 0)   # #990000
COLOR_BODY = com_rgb(40, 40, 40)      # #282828
COLOR_CARD_BG = com_rgb(248, 249, 250)
COLOR_CARD_BORDER = com_rgb(210, 215, 220)

ppt_path = os.path.abspath(r'd:\B.E final year project\B.E. Project Topic Finalisation Review Template.pptx')
out_dir = os.path.abspath(r'd:\B.E final year project\slides_preview')
os.makedirs(out_dir, exist_ok=True)

ppt = win32com.client.Dispatch('PowerPoint.Application')
prs = ppt.Presentations.Open(ppt_path, WithWindow=False)

# Reset slide count to 2 (keep Title and Contents as bases)
while prs.Slides.Count > 2:
    prs.Slides(prs.Slides.Count).Delete()

# Duplicate slide 2 for slides 3..8
for _ in range(6):
    prs.Slides(2).Duplicate()

# ---------------------------------------------------------
# SLIDE 1: Title Slide
# ---------------------------------------------------------
slide1 = prs.Slides(1)
for i in range(1, slide1.Shapes.Count + 1):
    shp = slide1.Shapes(i)
    if shp.HasTextFrame and "Project Title" in shp.TextFrame.TextRange.Text:
        tf = shp.TextFrame
        tf.TextRange.Text = "" # Clear text
        
        tr0 = tf.TextRange.Paragraphs(1)
        tr0.Text = "Project Title: AI Voice Support Agent Using Speech Recognition and Large Language Models\n\n"
        tr0.Font.Name = "Georgia"
        tr0.Font.Size = 20
        tr0.Font.Bold = True
        tr0.Font.Color.RGB = COLOR_RED
        tr0.ParagraphFormat.Alignment = 2 # Center
        
        tr1 = tf.TextRange.InsertAfter("Group No.: [Your Group Number]\n\n")
        tr1.Font.Name = "Georgia"
        tr1.Font.Size = 18
        tr1.Font.Bold = True
        tr1.Font.Color.RGB = COLOR_NAVY
        tr1.ParagraphFormat.Alignment = 2
        
        tr2 = tf.TextRange.InsertAfter("Group Members: [Add Member Names with Roll Numbers]\n\n\n")
        tr2.Font.Name = "Georgia"
        tr2.Font.Size = 18
        tr2.Font.Bold = True
        tr2.Font.Color.RGB = COLOR_PURPLE
        tr2.ParagraphFormat.Alignment = 2
        
        tr3 = tf.TextRange.InsertAfter("Project Guide\n[Guide Name]")
        tr3.Font.Name = "Georgia"
        tr3.Font.Size = 18
        tr3.Font.Bold = True
        tr3.Font.Color.RGB = COLOR_DARK_RED
        tr3.ParagraphFormat.Alignment = 2

# Helper function to clear body placeholder and set section title
def prep_slide(slide, title_text):
    body_shp = None
    for i in range(1, slide.Shapes.Count + 1):
        shp = slide.Shapes(i)
        if shp.HasTextFrame:
            if "Contents" in shp.TextFrame.TextRange.Text:
                shp.TextFrame.TextRange.Text = title_text
                shp.TextFrame.TextRange.Font.Name = "Times New Roman"
                shp.TextFrame.TextRange.Font.Size = 28
                shp.TextFrame.TextRange.Font.Bold = True
                shp.TextFrame.TextRange.Font.Color.RGB = COLOR_RED
                shp.TextFrame.TextRange.ParagraphFormat.Alignment = 2
            elif "1. Problem" in shp.TextFrame.TextRange.Text:
                body_shp = shp
    if body_shp:
        body_shp.Delete()

# ---------------------------------------------------------
# SLIDE 2: Contents
# ---------------------------------------------------------
slide2 = prs.Slides(2)
for i in range(1, slide2.Shapes.Count + 1):
    shp = slide2.Shapes(i)
    if shp.HasTextFrame:
        if "Contents" in shp.TextFrame.TextRange.Text:
            shp.TextFrame.TextRange.Font.Name = "Times New Roman"
            shp.TextFrame.TextRange.Font.Size = 28
            shp.TextFrame.TextRange.Font.Bold = True
            shp.TextFrame.TextRange.Font.Color.RGB = COLOR_RED
            shp.TextFrame.TextRange.ParagraphFormat.Alignment = 2
        elif "1. Problem" in shp.TextFrame.TextRange.Text:
            tr = shp.TextFrame.TextRange
            tr.Text = "1. Problem Statement\n2. Motivation\n3. Objectives\n4. Literature Survey\n5. Project Overview"
            tr.Font.Name = "Times New Roman"
            tr.Font.Size = 24
            tr.Font.Bold = True
            tr.Font.Color.RGB = COLOR_MAGENTA

# ---------------------------------------------------------
# SLIDE 3: Problem Statement
# ---------------------------------------------------------
slide3 = prs.Slides(3)
prep_slide(slide3, "Problem Statement")

# Card 1: Problem (Left)
card1 = slide3.Shapes.AddShape(5, 40, 130, 310, 245)
card1.Fill.Solid()
card1.Fill.ForeColor.RGB = com_rgb(253, 242, 242)
card1.Line.ForeColor.RGB = COLOR_RED
card1.Line.Weight = 1.5

tf1 = card1.TextFrame
tf1.MarginLeft = tf1.MarginRight = tf1.MarginTop = tf1.MarginBottom = 14
tf1.WordWrap = True

tr1 = tf1.TextRange.Paragraphs(1)
tr1.Text = "Problem\n\n"
tr1.Font.Name = "Georgia"
tr1.Font.Size = 20
tr1.Font.Bold = True
tr1.Font.Color.RGB = COLOR_RED
tr1.ParagraphFormat.Alignment = 1 # Left

p1 = tf1.TextRange.InsertAfter("• Traditional customer support systems depend on IVR menus or human agents, resulting in long waiting times, high operational costs, and inconsistent customer experiences.\n\n")
p1.Font.Name = "Times New Roman"
p1.Font.Size = 14
p1.Font.Color.RGB = COLOR_BODY
p1.ParagraphFormat.Alignment = 1

p2 = tf1.TextRange.InsertAfter("• Most existing systems fail to understand natural spoken language and cannot provide intelligent real-time assistance.")
p2.Font.Name = "Times New Roman"
p2.Font.Size = 14
p2.Font.Color.RGB = COLOR_BODY
p2.ParagraphFormat.Alignment = 1

# Card 2: Proposed Solution (Right)
card2 = slide3.Shapes.AddShape(5, 370, 130, 310, 245)
card2.Fill.Solid()
card2.Fill.ForeColor.RGB = com_rgb(240, 248, 255)
card2.Line.ForeColor.RGB = COLOR_NAVY
card2.Line.Weight = 1.5

tf2 = card2.TextFrame
tf2.MarginLeft = tf2.MarginRight = tf2.MarginTop = tf2.MarginBottom = 14
tf2.WordWrap = True

tr2 = tf2.TextRange.Paragraphs(1)
tr2.Text = "Proposed Solution\n\n"
tr2.Font.Name = "Georgia"
tr2.Font.Size = 20
tr2.Font.Bold = True
tr2.Font.Color.RGB = COLOR_NAVY
tr2.ParagraphFormat.Alignment = 1

p_sol = tf2.TextRange.InsertAfter("• Develop an AI-powered Voice Support Agent that listens to customer queries, converts speech into text, understands the user's intent using a Large Language Model (LLM), generates accurate responses, and converts them back into natural speech for seamless voice-based interaction.")
p_sol.Font.Name = "Times New Roman"
p_sol.Font.Size = 14
p_sol.Font.Color.RGB = COLOR_BODY
p_sol.ParagraphFormat.Alignment = 1


# ---------------------------------------------------------
# SLIDE 4: Motivation
# ---------------------------------------------------------
slide4 = prs.Slides(4)
prep_slide(slide4, "Motivation")

mot_card = slide4.Shapes.AddShape(5, 40, 130, 640, 245)
mot_card.Fill.Solid()
mot_card.Fill.ForeColor.RGB = COLOR_CARD_BG
mot_card.Line.ForeColor.RGB = COLOR_CARD_BORDER

tf = mot_card.TextFrame
tf.MarginLeft = tf.MarginRight = tf.MarginTop = tf.MarginBottom = 18
tf.WordWrap = True

m1 = tf.TextRange.Paragraphs(1)
m1.Text = "• Essential Business Need:\nCustomer service has become an essential part of every business, but manual support is expensive and difficult to scale.\n\n"
m1.Font.Name = "Times New Roman"
m1.Font.Size = 15
m1.Font.Color.RGB = COLOR_BODY
m1.ParagraphFormat.Alignment = 1

m2 = tf.TextRange.InsertAfter("• Technological Advancement:\nWith recent advancements in Artificial Intelligence, Speech Recognition, and Large Language Models, it is now possible to build intelligent voice assistants capable of providing instant, accurate, and human-like responses.\n\n")
m2.Font.Name = "Times New Roman"
m2.Font.Size = 15
m2.Font.Color.RGB = COLOR_BODY
m2.ParagraphFormat.Alignment = 1

m3 = tf.TextRange.InsertAfter("• Core Objective:\nOur motivation is to develop a smart AI Voice Support Agent that improves customer satisfaction while reducing operational costs.")
m3.Font.Name = "Times New Roman"
m3.Font.Size = 15
m3.Font.Color.RGB = COLOR_BODY
m3.ParagraphFormat.Alignment = 1


# ---------------------------------------------------------
# SLIDE 5: Objectives
# ---------------------------------------------------------
slide5 = prs.Slides(5)
prep_slide(slide5, "Objectives")

obj_card = slide5.Shapes.AddShape(5, 40, 130, 640, 245)
obj_card.Fill.Solid()
obj_card.Fill.ForeColor.RGB = COLOR_CARD_BG
obj_card.Line.ForeColor.RGB = COLOR_CARD_BORDER

tf = obj_card.TextFrame
tf.MarginLeft = tf.MarginRight = tf.MarginTop = tf.MarginBottom = 16
tf.WordWrap = True

objectives_list = [
    "Develop a real-time voice-based support system.",
    "Convert user speech into text accurately.",
    "Generate intelligent responses using an AI language model.",
    "Convert generated text into natural speech.",
    "Reduce customer waiting time.",
    "Improve service availability through 24×7 automated assistance.",
    "Provide a scalable and cost-effective customer support solution."
]

for idx, obj in enumerate(objectives_list):
    prefix = f"{idx+1}. "
    if idx == 0:
        tr = tf.TextRange.Paragraphs(1)
        tr.Text = f"• {obj}\n"
    else:
        tr = tf.TextRange.InsertAfter(f"• {obj}\n" if idx < len(objectives_list)-1 else f"• {obj}")
    tr.Font.Name = "Times New Roman"
    tr.Font.Size = 15
    tr.Font.Color.RGB = COLOR_BODY
    tr.ParagraphFormat.Alignment = 1


# ---------------------------------------------------------
# SLIDE 6: Literature Survey
# ---------------------------------------------------------
slide6 = prs.Slides(6)
prep_slide(slide6, "Literature Survey")

papers = [
    ("Research Paper 1", "Whisper: Robust Speech Recognition via Large-Scale Weak Supervision", "Contribution:\n• High-accuracy Speech-to-Text\n• Noise-resistant recognition"),
    ("Research Paper 2", "GPT-based Conversational AI for Customer Support", "Contribution:\n• Natural language understanding\n• Context-aware generation"),
    ("Research Paper 3", "Text-to-Speech Synthesis Using Neural Networks", "Contribution:\n• Human-like voice generation\n• Low-latency speech synthesis")
]

for i, (p_num, p_title, p_contrib) in enumerate(papers):
    card = slide6.Shapes.AddShape(5, 40 + i*218, 130, 204, 135)
    card.Fill.Solid()
    card.Fill.ForeColor.RGB = com_rgb(245, 247, 250)
    card.Line.ForeColor.RGB = COLOR_NAVY
    
    tf = card.TextFrame
    tf.MarginLeft = tf.MarginRight = tf.MarginTop = tf.MarginBottom = 8
    tf.WordWrap = True
    
    tr = tf.TextRange.Paragraphs(1)
    tr.Text = f"{p_num}\n"
    tr.Font.Name = "Georgia"
    tr.Font.Size = 13
    tr.Font.Bold = True
    tr.Font.Color.RGB = COLOR_NAVY
    tr.ParagraphFormat.Alignment = 1
    
    tr_t = tf.TextRange.InsertAfter(f"{p_title}\n\n")
    tr_t.Font.Name = "Times New Roman"
    tr_t.Font.Size = 11
    tr_t.Font.Bold = True
    tr_t.Font.Color.RGB = COLOR_DARK_RED
    tr_t.ParagraphFormat.Alignment = 1
    
    tr_c = tf.TextRange.InsertAfter(p_contrib)
    tr_c.Font.Name = "Times New Roman"
    tr_c.Font.Size = 11
    tr_c.Font.Color.RGB = COLOR_BODY
    tr_c.ParagraphFormat.Alignment = 1

# Gap Card
gap_card = slide6.Shapes.AddShape(5, 40, 275, 640, 100)
gap_card.Fill.Solid()
gap_card.Fill.ForeColor.RGB = com_rgb(254, 243, 235)
gap_card.Line.ForeColor.RGB = COLOR_RED
gap_card.Line.Weight = 1.5

tf = gap_card.TextFrame
tf.MarginLeft = tf.MarginRight = tf.MarginTop = tf.MarginBottom = 10
tf.WordWrap = True

tr = tf.TextRange.Paragraphs(1)
tr.Text = "Research Gap\n"
tr.Font.Name = "Georgia"
tr.Font.Size = 15
tr.Font.Bold = True
tr.Font.Color.RGB = COLOR_RED
tr.ParagraphFormat.Alignment = 1

tr_g = tf.TextRange.InsertAfter("• Existing IVR systems are rule-based.\t• Limited contextual understanding.\n• Lack of natural conversation.\t\t• High dependency on human agents.")
tr_g.Font.Name = "Times New Roman"
tr_g.Font.Size = 14
tr_g.Font.Color.RGB = COLOR_BODY
tr_g.ParagraphFormat.Alignment = 1


# ---------------------------------------------------------
# SLIDE 7: Project Overview
# ---------------------------------------------------------
slide7 = prs.Slides(7)
prep_slide(slide7, "Project Overview")

# Left Column: System Workflow Vertical Diagram Container Box
wf_card = slide7.Shapes.AddShape(5, 40, 130, 280, 245)
wf_card.Fill.Solid()
wf_card.Fill.ForeColor.RGB = com_rgb(245, 247, 252)
wf_card.Line.ForeColor.RGB = COLOR_NAVY
wf_card.Line.Weight = 1.5

# Workflow Header Box
wf_title = slide7.Shapes.AddTextbox(1, 40, 133, 280, 25)
wf_title.Fill.Visible = False
wf_title.Line.Visible = False
tr = wf_title.TextFrame.TextRange
tr.Text = "System Workflow"
tr.Font.Name = "Georgia"
tr.Font.Size = 15
tr.Font.Bold = True
tr.Font.Color.RGB = COLOR_NAVY
tr.ParagraphFormat.Alignment = 2

steps = [
    "User Speaks",
    "Speech-to-Text",
    "Speech Processing",
    "Intent Detection",
    "Large Language Model",
    "Response Generation",
    "Text-to-Speech",
    "Voice Response to User"
]

step_y = 160
step_h = 17
step_w = 230
step_x = 65

for i, st in enumerate(steps):
    # Step box
    s_shp = slide7.Shapes.AddShape(5, step_x, step_y + i*26, step_w, step_h)
    s_shp.Fill.Solid()
    if i in [0, 7]:
        s_shp.Fill.ForeColor.RGB = COLOR_NAVY
        txt_c = com_rgb(255, 255, 255)
    elif i in [1, 6]:
        s_shp.Fill.ForeColor.RGB = COLOR_MAGENTA
        txt_c = com_rgb(255, 255, 255)
    elif i in [4, 5]:
        s_shp.Fill.ForeColor.RGB = COLOR_RED
        txt_c = com_rgb(255, 255, 255)
    else:
        s_shp.Fill.ForeColor.RGB = com_rgb(230, 235, 245)
        txt_c = COLOR_NAVY
    s_shp.Line.Visible = False
    
    tf_s = s_shp.TextFrame
    tf_s.MarginLeft = tf_s.MarginRight = tf_s.MarginTop = tf_s.MarginBottom = 1
    tr_s = tf_s.TextRange
    tr_s.Text = st
    tr_s.Font.Name = "Times New Roman"
    tr_s.Font.Size = 10
    tr_s.Font.Bold = True
    tr_s.Font.Color.RGB = txt_c
    tr_s.ParagraphFormat.Alignment = 2

    # Add down connector arrow between steps (Shape 35 = msoShapeDownArrow, rotated 180)
    if i < len(steps) - 1:
        arr = slide7.Shapes.AddShape(35, step_x + step_w//2 - 4, step_y + i*26 + step_h + 1, 8, 7)
        arr.Rotation = 180
        arr.Fill.Solid()
        arr.Fill.ForeColor.RGB = COLOR_NAVY
        arr.Line.Visible = False

# Right Top: Technology Stack
tech_card = slide7.Shapes.AddShape(5, 340, 130, 340, 140)
tech_card.Fill.Solid()
tech_card.Fill.ForeColor.RGB = COLOR_CARD_BG
tech_card.Line.ForeColor.RGB = COLOR_CARD_BORDER

tf = tech_card.TextFrame
tf.MarginLeft = tf.MarginRight = tf.MarginTop = tf.MarginBottom = 10
tf.WordWrap = True

tr = tf.TextRange.Paragraphs(1)
tr.Text = "Technology Stack\n\n"
tr.Font.Name = "Georgia"
tr.Font.Size = 15
tr.Font.Bold = True
tr.Font.Color.RGB = COLOR_NAVY
tr.ParagraphFormat.Alignment = 1

tr_t = tf.TextRange.InsertAfter("• Programming & Frameworks: Python, FastAPI, React (Optional)\n• AI & Voice APIs: OpenAI Whisper (STT), GPT-4 / Llama (LLM), ElevenLabs (TTS)\n• Database: MongoDB / PostgreSQL")
tr_t.Font.Name = "Times New Roman"
tr_t.Font.Size = 13
tr_t.Font.Color.RGB = COLOR_BODY
tr_t.ParagraphFormat.Alignment = 1

# Right Bottom: Expected Outcome
out_card = slide7.Shapes.AddShape(5, 340, 280, 340, 95)
out_card.Fill.Solid()
out_card.Fill.ForeColor.RGB = com_rgb(240, 248, 240)
out_card.Line.ForeColor.RGB = com_rgb(40, 140, 60)
out_card.Line.Weight = 1.5

tf = out_card.TextFrame
tf.MarginLeft = tf.MarginRight = tf.MarginTop = tf.MarginBottom = 10
tf.WordWrap = True

tr = tf.TextRange.Paragraphs(1)
tr.Text = "Expected Outcome\n"
tr.Font.Name = "Georgia"
tr.Font.Size = 15
tr.Font.Bold = True
tr.Font.Color.RGB = com_rgb(30, 110, 45)
tr.ParagraphFormat.Alignment = 1

tr_o = tf.TextRange.InsertAfter("The proposed system will provide intelligent, real-time, voice-based customer support with faster response time, higher accuracy, reduced operational cost, and improved user experience.")
tr_o.Font.Name = "Times New Roman"
tr_o.Font.Size = 12
tr_o.Font.Color.RGB = COLOR_BODY
tr_o.ParagraphFormat.Alignment = 1


# ---------------------------------------------------------
# SLIDE 8: Thank You
# ---------------------------------------------------------
slide8 = prs.Slides(8)
prep_slide(slide8, "")

ty_card = slide8.Shapes.AddShape(5, 110, 140, 500, 200)
ty_card.Fill.Solid()
ty_card.Fill.ForeColor.RGB = com_rgb(255, 255, 255)
ty_card.Line.ForeColor.RGB = COLOR_NAVY
ty_card.Line.Weight = 2

tf = ty_card.TextFrame
tf.MarginLeft = tf.MarginRight = tf.MarginTop = tf.MarginBottom = 20
tf.WordWrap = True

tr = tf.TextRange.Paragraphs(1)
tr.Text = "Thank You\n\n"
tr.Font.Name = "Times New Roman"
tr.Font.Size = 36
tr.Font.Bold = True
tr.Font.Color.RGB = COLOR_RED
tr.ParagraphFormat.Alignment = 2

tr_q = tf.TextRange.InsertAfter("Questions & Discussion")
tr_q.Font.Name = "Georgia"
tr_q.Font.Size = 24
tr_q.Font.Bold = True
tr_q.Font.Color.RGB = COLOR_NAVY
tr_q.ParagraphFormat.Alignment = 2

# Export all slides to PNG
for i in range(1, prs.Slides.Count + 1):
    slide_path = os.path.join(out_dir, f"slide_{i}.png")
    prs.Slides(i).Export(slide_path, "PNG", 1920, 1080)
    print(f"Exported slide {i} to {slide_path}")

prs.Save()
prs.Close()
ppt.Quit()
print("Successfully generated perfect presentation!")
