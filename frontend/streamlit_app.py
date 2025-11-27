"""
Streamlit frontend for Reddit Year Prediction Demo.
"""

import os
import sys
from pathlib import Path

import streamlit as st
import requests

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

# Try to use local predictor if API is not available
try:
    from src.predict import YearPredictor
    USE_LOCAL = True
except ImportError:
    USE_LOCAL = False

# Configuration
API_URL = os.getenv("API_URL", "http://localhost:8000")
MODEL_PATH_REGRESSION = os.getenv("MODEL_PATH_REGRESSION", "./reddit_year_model_regressor")
MODEL_PATH_CLASSIFICATION = os.getenv("MODEL_PATH_CLASSIFICATION", "./reddit_year_model_classifier")

# Page config
st.set_page_config(
    page_title="Reddit Year Prediction",
    page_icon="📅",
    layout="wide"
)

# Title
st.title("📅 Reddit Comment Year Predictor")
st.markdown("""
This app predicts the year when a Reddit comment was posted based on its text.
The model analyzes linguistic patterns that have changed over time on Reddit (2006-2024).
""")

# Sidebar
st.sidebar.header("Settings")
use_api = st.sidebar.checkbox("Use API (if available)", value=False)
task_type = st.sidebar.selectbox("Task Type", ["regression", "classification"], index=0)

# Load local predictor if not using API
local_predictor = None
if USE_LOCAL and not use_api:
    try:
        model_path = MODEL_PATH_REGRESSION if task_type == "regression" else MODEL_PATH_CLASSIFICATION
        if os.path.exists(model_path):
            with st.spinner("Loading model..."):
                local_predictor = YearPredictor(
                    model_path=model_path,
                    task_type=task_type,
                    start_year=2006,
                    end_year=2024
                )
            st.sidebar.success("Model loaded!")
        else:
            st.sidebar.warning(f"Model not found at {model_path}")
    except Exception as e:
        st.sidebar.error(f"Error loading model: {e}")

# Main content
tab1, tab2 = st.tabs(["Single Prediction", "Batch Prediction"])

with tab1:
    st.header("Single Comment Prediction")
    
    # Input
    comment_text = st.text_area(
        "Enter a Reddit-style comment:",
        height=150,
        placeholder="e.g., 'This is the way. IYKYK'"
    )
    
    if st.button("Predict Year", type="primary"):
        if not comment_text.strip():
            st.error("Please enter a comment.")
        else:
            with st.spinner("Predicting..."):
                try:
                    if use_api:
                        # Use API
                        response = requests.post(
                            f"{API_URL}/predict",
                            json={"text": comment_text, "task_type": task_type},
                            timeout=10
                        )
                        if response.status_code == 200:
                            result = response.json()
                        else:
                            st.error(f"API Error: {response.text}")
                            result = None
                    else:
                        # Use local predictor
                        if local_predictor:
                            result = local_predictor.predict(comment_text)
                        else:
                            st.error("Model not available. Please train a model first.")
                            result = None
                    
                    if result:
                        # Display results
                        col1, col2 = st.columns(2)
                        
                        with col1:
                            st.metric("Predicted Year", result["predicted_year"])
                        
                        with col2:
                            if "confidence" in result and result["confidence"]:
                                st.metric("Confidence", f"{result['confidence']:.1%}")
                        
                        # Show class probabilities if available
                        if "class_probabilities" in result and result["class_probabilities"]:
                            st.subheader("Class Probabilities")
                            probs = result["class_probabilities"]
                            for year, prob in sorted(probs.items()):
                                st.progress(prob, text=f"{year}: {prob:.1%}")
                        
                        # Show raw prediction info for regression
                        if "year_index" in result and result["year_index"] is not None:
                            st.caption(f"Year Index: {result['year_index']:.2f}")
                
                except requests.exceptions.RequestException as e:
                    st.error(f"API connection error: {e}")
                    st.info("Make sure the API is running: `uvicorn api.main:app --reload`")
                except Exception as e:
                    st.error(f"Prediction error: {e}")

with tab2:
    st.header("Batch Prediction")
    
    # Input
    comments_text = st.text_area(
        "Enter multiple comments (one per line):",
        height=200,
        placeholder="Comment 1\nComment 2\nComment 3"
    )
    
    if st.button("Predict All", type="primary"):
        if not comments_text.strip():
            st.error("Please enter comments.")
        else:
            comments = [c.strip() for c in comments_text.split("\n") if c.strip()]
            
            if not comments:
                st.error("No valid comments found.")
            else:
                with st.spinner(f"Predicting {len(comments)} comments..."):
                    try:
                        if use_api:
                            # Use API
                            response = requests.post(
                                f"{API_URL}/predict/batch",
                                json=comments,
                                timeout=30
                            )
                            if response.status_code == 200:
                                results = response.json()["predictions"]
                            else:
                                st.error(f"API Error: {response.text}")
                                results = None
                        else:
                            # Use local predictor
                            if local_predictor:
                                results = local_predictor.predict_batch(comments)
                            else:
                                st.error("Model not available.")
                                results = None
                        
                        if results:
                            # Display results in a table
                            import pandas as pd
                            
                            data = []
                            for i, (comment, result) in enumerate(zip(comments, results)):
                                data.append({
                                    "Comment": comment[:100] + "..." if len(comment) > 100 else comment,
                                    "Predicted Year": result["predicted_year"],
                                    "Confidence": f"{result.get('confidence', 0):.1%}" if result.get('confidence') else "N/A"
                                })
                            
                            df = pd.DataFrame(data)
                            st.dataframe(df, use_container_width=True)
                            
                            # Summary statistics
                            if len(results) > 1:
                                years = [r["predicted_year"] for r in results]
                                st.subheader("Summary")
                                col1, col2, col3 = st.columns(3)
                                with col1:
                                    st.metric("Mean Year", f"{sum(years)/len(years):.1f}")
                                with col2:
                                    st.metric("Min Year", min(years))
                                with col3:
                                    st.metric("Max Year", max(years))
                    
                    except requests.exceptions.RequestException as e:
                        st.error(f"API connection error: {e}")
                    except Exception as e:
                        st.error(f"Batch prediction error: {e}")

# Footer
st.markdown("---")
st.markdown("""
**About:** This model was trained on Reddit comments from 2006-2024 to detect linguistic changes over time.
The model uses transformer-based architectures (DistilBERT for classification, RoBERTa for regression).
""")

