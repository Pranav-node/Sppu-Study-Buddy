import os
from PIL import Image, ImageDraw, ImageFont

icons_dir = r'd:\B.E final year project\icons'
os.makedirs(icons_dir, exist_ok=True)

def create_circle_icon(filename, bg_color, draw_func):
    size = (256, 256)
    img = Image.new("RGBA", size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    # Draw smooth background circle
    draw.ellipse([8, 8, 248, 248], fill=bg_color)
    draw_func(draw)
    img.save(os.path.join(icons_dir, filename), "PNG")
    print(f"Saved {filename}")

# 1. Microphone Icon
def draw_mic(draw):
    # Mic body
    draw.rounded_rectangle([108, 60, 148, 140], radius=20, fill=(255, 255, 255, 255))
    # Stand arc
    draw.arc([88, 100, 168, 170], start=0, end=180, fill=(255, 255, 255, 255), width=8)
    # Stand pole & base
    draw.line([128, 170, 128, 200], fill=(255, 255, 255, 255), width=8)
    draw.line([100, 200, 156, 200], fill=(255, 255, 255, 255), width=8)

# 2. AI / Brain / Spark Icon
def draw_ai(draw):
    # Center node & connecting lines
    center = (128, 128)
    nodes = [(128, 70), (180, 100), (180, 160), (128, 190), (76, 160), (76, 100)]
    for n in nodes:
        draw.line([center, n], fill=(255, 255, 255, 200), width=6)
    draw.polygon(nodes, outline=(255, 255, 255, 255), width=6)
    for n in nodes + [center]:
        draw.ellipse([n[0]-12, n[1]-12, n[0]+12, n[1]+12], fill=(255, 255, 255, 255))

# 3. Chatbot / Voice Headset Icon
def draw_chatbot(draw):
    # Headset band
    draw.arc([68, 68, 188, 178], start=190, end=350, fill=(255, 255, 255, 255), width=10)
    # Ear pads
    draw.rounded_rectangle([60, 110, 84, 160], radius=10, fill=(255, 255, 255, 255))
    draw.rounded_rectangle([172, 110, 196, 160], radius=10, fill=(255, 255, 255, 255))
    # Mic boom
    draw.arc([140, 140, 188, 188], start=0, end=90, fill=(255, 255, 255, 255), width=8)
    draw.ellipse([132, 180, 148, 196], fill=(255, 255, 255, 255))

# 4. Cloud Icon
def draw_cloud(draw):
    draw.ellipse([70, 110, 130, 170], fill=(255, 255, 255, 255))
    draw.ellipse([110, 80, 180, 150], fill=(255, 255, 255, 255))
    draw.ellipse([150, 110, 200, 170], fill=(255, 255, 255, 255))
    draw.rectangle([100, 130, 175, 170], fill=(255, 255, 255, 255))

# Generate icons with theme colors matching PPTX: dark blue #002060, dark red #C00000, purple #6600CC, teal/dark green
create_circle_icon("mic_icon.png", (192, 0, 0, 255), draw_mic)
create_circle_icon("ai_icon.png", (0, 32, 96, 255), draw_ai)
create_circle_icon("chatbot_icon.png", (102, 0, 204, 255), draw_chatbot)
create_circle_icon("cloud_icon.png", (204, 0, 102, 255), draw_cloud)
