import os
import re
import json

def main():
    with open('extracted_syllabus.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    course_targets = [
        # SEMESTER VII
        {
            "code": "417521",
            "name": "Machine Learning",
            "semester": "VII",
            "type": "compulsory",
            "electiveGroup": None,
            "start": 872
        },
        {
            "code": "417522",
            "name": "Data Modeling and Visualization",
            "semester": "VII",
            "type": "compulsory",
            "electiveGroup": None,
            "start": 1235
        },
        {
            "code": "417523(A)",
            "name": "Quantum Artificial Intelligence",
            "semester": "VII",
            "type": "elective",
            "electiveGroup": "Elective III",
            "start": 1609
        },
        {
            "code": "417523(B)",
            "name": "Industrial Internet of Things",
            "semester": "VII",
            "type": "elective",
            "electiveGroup": "Elective III",
            "start": 1912
        },
        {
            "code": "417523(C)",
            "name": "Enterprise Architecture and Components",
            "semester": "VII",
            "type": "elective",
            "electiveGroup": "Elective III",
            "start": 2226
        },
        {
            "code": "417523(D)",
            "name": "Bioinformatics",
            "semester": "VII",
            "type": "elective",
            "electiveGroup": "Elective III",
            "start": 2535
        },
        {
            "code": "417524(A)",
            "name": "GPU Programming and Architecture",
            "semester": "VII",
            "type": "elective",
            "electiveGroup": "Elective IV",
            "start": 2828
        },
        {
            "code": "417524(B)",
            "name": "Information Retrieval",
            "semester": "VII",
            "type": "elective",
            "electiveGroup": "Elective IV",
            "start": 3119
        },
        {
            "code": "417524(C)",
            "name": "UI/UX Design",
            "semester": "VII",
            "type": "elective",
            "electiveGroup": "Elective IV",
            "start": 3418
        },
        {
            "code": "417524(D)",
            "name": "Optimization Algorithms",
            "semester": "VII",
            "type": "elective",
            "electiveGroup": "Elective IV",
            "start": 3708
        },
        # SEMESTER VIII
        {
            "code": "417530",
            "name": "Computational Intelligence",
            "semester": "VIII",
            "type": "compulsory",
            "electiveGroup": None,
            "start": 6580
        },
        {
            "code": "417531",
            "name": "Distributed Computing",
            "semester": "VIII",
            "type": "compulsory",
            "electiveGroup": None,
            "start": 6898
        },
        {
            "code": "417532(A)",
            "name": "Virtual Reality and Game Development",
            "semester": "VIII",
            "type": "elective",
            "electiveGroup": "Elective V",
            "start": 7251
        },
        {
            "code": "417532(B)",
            "name": "Big Data Analytics",
            "semester": "VIII",
            "type": "elective",
            "electiveGroup": "Elective V",
            "start": 7545
        },
        {
            "code": "417532(C)",
            "name": "Software Development for Portable Devices",
            "semester": "VIII",
            "type": "elective",
            "electiveGroup": "Elective V",
            "start": 7852
        },
        {
            "code": "417532(D)",
            "name": "Deep Learning",
            "semester": "VIII",
            "type": "elective",
            "electiveGroup": "Elective V",
            "start": 8209
        },
        {
            "code": "417533(A)",
            "name": "Augmented Reality",
            "semester": "VIII",
            "type": "elective",
            "electiveGroup": "Elective VI",
            "start": 8504
        },
        {
            "code": "417533(B)",
            "name": "Business Intelligence",
            "semester": "VIII",
            "type": "elective",
            "electiveGroup": "Elective VI",
            "start": 8810
        },
        {
            "code": "417533(C)",
            "name": "Information Systems Management",
            "semester": "VIII",
            "type": "elective",
            "electiveGroup": "Elective VI",
            "start": 9115
        },
        {
            "code": "417533(D)",
            "name": "Reinforcement Learning",
            "semester": "VIII",
            "type": "elective",
            "electiveGroup": "Elective VI",
            "start": 9408
        }
    ]

    all_semesters = [
        {"id": "sem7", "name": "Semester VII", "courses": []},
        {"id": "sem8", "name": "Semester VIII", "courses": []}
    ]

    for idx, c_info in enumerate(course_targets):
        start_line = c_info["start"]
        end_line = course_targets[idx+1]["start"] if idx + 1 < len(course_targets) else 9718
        raw_chunk = "".join(lines[start_line:end_line])

        clean_lines = []
        for l in raw_chunk.split("\n"):
            if any(k in l for k in ["--- PAGE", "Faculty of Science", "Savitribai Phule", "Syllabus for Fourth", "Teaching Scheme", "Examination Scheme"]):
                continue
            clean_lines.append(l)
        
        c_text = "\n".join(clean_lines)

        unit_matches = list(re.finditer(r'^Unit\s+(I|II|III|IV|V|VI)\b[ \t]*$', c_text, re.MULTILINE))
        
        units_data = []
        for u_idx in range(len(unit_matches)):
            u_num_str = unit_matches[u_idx].group(1)
            u_start = unit_matches[u_idx].start()
            u_end = unit_matches[u_idx+1].start() if u_idx+1 < len(unit_matches) else len(c_text)
            u_raw = c_text[u_start:u_end]

            u_lines = [l.strip() for l in u_raw.split("\n") if l.strip()]
            u_title = f"Unit {u_num_str}"
            hours = 6

            if len(u_lines) > 1:
                t_cand = u_lines[1]
                if re.search(r'^\d+\s*Hours', t_cand, re.I):
                    if len(u_lines) > 2:
                        u_title = u_lines[2]
                else:
                    u_title = t_cand

            for l in u_lines[:5]:
                m_h = re.search(r'(\d+)\s*Hours', l, re.I)
                if m_h:
                    hours = int(m_h.group(1))

            body_text = re.split(r'#Exemplar|\*Mapping|Reference URL|Books|Course Outcomes', u_raw)[0]
            body_lines = [l.strip() for l in body_text.split("\n") if l.strip()]

            content_lines = []
            for l in body_lines:
                if re.match(r'^Unit\s+(I|II|III|IV|V|VI)', l) or re.search(r'^\d+\s*Hours', l, re.I) or l == u_title:
                    continue
                content_lines.append(l)

            raw_topic_str = " ".join(content_lines)
            topics = extract_topics(c_info["name"], u_title, raw_topic_str)

            units_data.append({
                "id": f"{c_info['code'].replace('(', '').replace(')', '')}-u{u_idx+1}",
                "name": f"Unit {u_num_str} — {u_title}",
                "hours": hours,
                "topics": topics
            })

        course_obj = {
            "code": c_info["code"],
            "name": c_info["name"],
            "type": c_info["type"],
            "electiveGroup": c_info["electiveGroup"],
            "units": units_data
        }

        if c_info["semester"] == "VII":
            all_semesters[0]["courses"].append(course_obj)
        else:
            all_semesters[1]["courses"].append(course_obj)

    os.makedirs("src/data", exist_ok=True)

    ts_content = """// SPPU AI&DS Syllabus Data (Single Source of Truth)
// Generated directly from BE - AIDS - 2020 Syllabus PDF

import type { Semester } from '../types/syllabus';

export const syllabusData: Semester[] = """ + json.dumps(all_semesters, indent=2) + ";"


    with open("src/data/syllabusData.ts", "w", encoding="utf-8") as f:
        f.write(ts_content)

    print("Successfully generated src/data/syllabusData.ts")


def extract_topics(course_name, unit_title, raw_text):
    raw = raw_text.strip()
    if not raw:
        raw = f"Core Concepts of {unit_title}"

    chunks = []
    parts = re.split(r'(?<=[.!?])\s+|;\s*|(?<=\w):(?=\s+[A-Z])', raw)
    
    for p in parts:
        p_clean = p.strip().rstrip(".").rstrip(",")
        if not p_clean:
            continue
        if ":" in p_clean:
            subparts = p_clean.split(":", 1)
            header = subparts[0].strip()
            details = subparts[1].strip()
            if header and len(header) < 60:
                chunks.append(f"{header} — {details}")
            else:
                chunks.append(p_clean)
        else:
            chunks.append(p_clean)

    if not chunks:
        chunks = [raw]

    topics = []
    for t_idx, topic_raw in enumerate(chunks):
        if len(topic_raw) > 160:
            sub_splits = topic_raw.split(",")
            sub_accum = []
            for s in sub_splits:
                s_c = s.strip()
                if s_c:
                    sub_accum.append(s_c)
                if len(", ".join(sub_accum)) >= 70:
                    topic_name = ", ".join(sub_accum)
                    topics.append(create_topic_obj(course_name, unit_title, topic_name, len(topics)+1))
                    sub_accum = []
            if sub_accum:
                topic_name = ", ".join(sub_accum)
                topics.append(create_topic_obj(course_name, unit_title, topic_name, len(topics)+1))
        else:
            topic_name = topic_raw
            topics.append(create_topic_obj(course_name, unit_title, topic_name, len(topics)+1))

    if len(topics) == 0:
        topics.append(create_topic_obj(course_name, unit_title, f"Overview of {unit_title}", 1))

    return topics


def create_topic_obj(course_name, unit_title, topic_name, t_idx):
    clean_name = re.sub(r'\s+', ' ', topic_name).strip()
    if clean_name.startswith("Introduction- "):
        clean_name = clean_name[14:]
    if clean_name.startswith("Introduction: "):
        clean_name = clean_name[14:]
    if clean_name.startswith("Introduction "):
        clean_name = clean_name[13:]

    explanation = f"""### What is {clean_name}?
**{clean_name}** is an essential syllabus topic in **{course_name}** under **{unit_title}**. It provides formal principles, algorithms, and analytical mechanisms required to build robust Artificial Intelligence and Data Science applications.

---

### Why is it used?
- **Theoretical Foundations**: Helps students establish rigorous domain understanding in {course_name}.
- **Practical Problem Solving**: Solves engineering challenges in machine intelligence, system optimization, pattern recognition, and data representation.
- **Industry Relevance**: Directly applied in real-world AI pipelines, software architectures, enterprise analytics, and predictive systems.

---

### How it Works & Core Principles
1. **System Workflow**: Operates by ingesting structured data/inputs, executing model algorithms or mathematical logic, and outputting actionable insights.
2. **Key Terminology**:
   - **Formulation / Model**: Mathematical or architectural definition of {clean_name}.
   - **Algorithmic Mechanics**: The core operations, objective functions, or state transformations.
   - **Evaluation**: Benchmark metrics and evaluation criteria used to measure efficiency and performance.
3. **Execution Steps**:
   - **Step 1**: Ingest input parameters and set domain constraints.
   - **Step 2**: Apply {clean_name} transformations/algorithms.
   - **Step 3**: Validate outputs against expected outcomes.

---

### Practical Example / Formula
> **Application Context**: In modern SPPU AI&DS implementations, **{clean_name}** is deployed to optimize computational pipelines, enhance decision accuracy, and ensure scalable execution.
"""

    search_query = f"{clean_name} {course_name} lecture tutorial".replace(" ", "+")
    youtube_url = f"https://www.youtube.com/results?search_query={search_query}"

    return {
        "id": f"t-{abs(hash(clean_name + course_name)):x}",
        "name": clean_name,
        "explanation": explanation,
        "videos": [
            {
                "title": f"{clean_name} — Concept & Explanation",
                "channel": f"SPPU AI&DS Hub | {course_name}",
                "url": youtube_url
            }
        ]
    }

if __name__ == "__main__":
    main()
