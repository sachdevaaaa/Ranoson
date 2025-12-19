import os
import time
import json
import google.generativeai as genai
from moviepy.video.io.VideoFileClip import VideoFileClip

# --- CONFIGURATION ---
API_KEY = "AIzaSyBgw5TNL__HzNauwpUYgUher7XoNRmtAAg"  # Replace with your key
MODEL_NAME = "gemini-2.0-flash-lite"         # Lite version with higher quota

# --- PROMPTS ---

# 1. THE ARCHITECT: Identifies the structure
DISCOVERY_PROMPT = """
You are an expert Instructional Designer. Analyze this video and break it down into distinct learning modules (nuances).
For each module, identify the exact start and end times where a specific sub-topic is taught.
Return ONLY a raw JSON array:
[
  {"topic_name": "Topic Title", "start_time": 0.0, "end_time": 15.5},
  ...
]
"""

# 2. THE PROFESSOR: Creates the content
CONTENT_PROMPT_TEMPLATE = """
You are an expert Professor creating a course module for the topic: "{topic}".
Focus ONLY on the video segment from {start} seconds to {end} seconds.

Create a comprehensive course document in Markdown format. It must include:
1. **Module Title & Learning Objectives**: What will the student learn?
2. **Deep Dive Lecture Notes**: A detailed technical explanation of what is shown/discussed in this specific segment. Use bullet points and bold text for key concepts.
3. **Key Terminology**: Definitions of jargon used.
4. **Practical Application**: How is this applied in real life?
5. **Quiz**: 3 multiple-choice questions to test understanding (with answers at the bottom).

Do not reference "the video" broadly; treat this as standalone text content.
"""

class CourseGenerator:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(MODEL_NAME)

    def upload_to_gemini(self, video_path):
        """Uploads video to Google's server."""
        print(f"⬆️  Uploading {video_path}...")
        video_file = genai.upload_file(path=video_path)
        
        while video_file.state.name == "PROCESSING":
            print("⏳ Processing video...", end="\r")
            time.sleep(2)
            video_file = genai.get_file(video_file.name)
            
        if video_file.state.name == "FAILED":
            raise ValueError("Video processing failed.")
            
        print(f"✅ Video ready: {video_file.name}")
        return video_file

    def analyze_structure(self, video_file):
        """Step 1: Get the timestamps."""
        print("🧠 Analyzing course structure...")
        response = self.model.generate_content(
            [video_file, DISCOVERY_PROMPT],
            generation_config={"response_mime_type": "application/json"}
        )
        try:
            return json.loads(response.text)
        except:
            print("❌ Error parsing JSON.")
            return []

    def generate_module_content(self, video_file, topic, start, end):
        """Step 2: Generate the text course content for a specific segment."""
        print(f"   ✍️  Writing course content for: {topic}...")
        
        # We send the FULL video file again, but instruct the AI to focus ONLY on the specific timestamps
        specific_prompt = CONTENT_PROMPT_TEMPLATE.format(
            topic=topic, start=start, end=end
        )
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = self.model.generate_content([video_file, specific_prompt])
                return response.text
            except Exception as e:
                if "429" in str(e) or "ResourceExhausted" in str(e):
                    # Extract wait time from error message if available
                    import re
                    match = re.search(r'retry in (\d+\.?\d*)s', str(e))
                    wait_time = float(match.group(1)) + 1 if match else 60
                    print(f"   ⏳ Rate limit hit. Waiting {wait_time:.0f} seconds...")
                    time.sleep(wait_time)
                    if attempt == max_retries - 1:
                        raise
                else:
                    raise

    def process_video(self, source_path, output_dir="course_output"):
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # 1. Upload
        gemini_file = self.upload_to_gemini(source_path)

        # 2. Analyze Structure
        modules = self.analyze_structure(gemini_file)
        
        print(f"\n📋 Course Plan: Found {len(modules)} modules.")
        
        # 3. Process each module
        with VideoFileClip(source_path) as video:
            for idx, module in enumerate(modules):
                topic_clean = module['topic_name'].replace(" ", "_").replace("/", "-")
                base_name = f"{idx+1}_{topic_clean}"
                
                start = float(module['start_time'])
                end = float(module['end_time'])
                
                print(f"\n--- Processing Module {idx+1}: {module['topic_name']} ---")

                # A. CUT THE VIDEO
                video_filename = f"{base_name}.mp4"
                save_path_video = os.path.join(output_dir, video_filename)
                
                # Safety check for duration
                if end > video.duration: end = video.duration
                
                if start < end:
                    new_clip = video.subclipped(start_time=start, end_time=end)
                    new_clip.write_videofile(save_path_video, codec="libx264", audio_codec="aac", logger=None)
                    print(f"   ✅ Video Clip Saved")
                
                # B. WRITE THE COURSE CONTENT
                # We ask Gemini to generate content specifically for this timestamp range
                course_content = self.generate_module_content(gemini_file, module['topic_name'], start, end)
                
                md_filename = f"{base_name}.md"
                save_path_md = os.path.join(output_dir, md_filename)
                
                with open(save_path_md, "w", encoding="utf-8") as f:
                    f.write(course_content)
                print(f"   ✅ Course Text Saved")
                
                # Rate limit safety (free tier - wait longer to avoid quota issues)
                print(f"   ⏸️  Waiting 5 seconds before next module...")
                time.sleep(5) 

        # Cleanup
        genai.delete_file(gemini_file.name)
        print("\n🎉 Course Generation Complete!")

# --- EXECUTION ---
if __name__ == "__main__":
    SOURCE = "your_video.mp4" # <--- INPUT FILE HERE
    
    if os.path.exists(SOURCE):
        generator = CourseGenerator(API_KEY)
        generator.process_video(SOURCE)
    else:
        print("File not found.")