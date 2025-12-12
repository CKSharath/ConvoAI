# app/services/summarizer.py

from transformers import pipeline

# Load summarizer model once (keeps app fast)
summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn"
)

def generate_summary(text: str):
    """
    Summarizes mission logs, hazard reports, SOS alerts, 
    or any long text in the system.
    """
    if not text or len(text.strip()) == 0:
        return "No information provided."

    result = summarizer(
        text,
        max_length=120,
        min_length=40,
        do_sample=False
    )

    return result[0]["summary_text"]
