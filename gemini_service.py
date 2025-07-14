import json
import logging
import os
from typing import Dict, Any, Optional

from google import genai
from google.genai import types
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.DEBUG)

class GeminiService:
    def __init__(self):
        """Initialize Gemini client with API key"""
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        self.client = genai.Client(api_key=api_key)
        
    def get_item_details_and_alternatives(self, item_name: str) -> Optional[Dict[str, Any]]:
        """Get comprehensive item details and alternatives from Gemini"""
        try:
            system_prompt = """You are an expert product analyst and alternative finder. 
            Analyze the given item and provide comprehensive information including alternatives.
            
            Response format (JSON):
            {
                "original_item": {
                    "name": "item name",
                    "description": "detailed description",
                    "usage": "primary uses and applications",
                    "availability": "availability status in India",
                    "price_inr": "price range in Indian Rupees",
                    "performance": "performance characteristics and ratings",
                    "category": "product category"
                },
                "alternatives": [
                    {
                        "name": "alternative name",
                        "description": "brief description",
                        "category": "category type",
                        "usage": "how it's used",
                        "price_inr": "price in INR",
                        "availability": "availability status",
                        "performance": "performance metrics",
                        "compatibility": "compatibility with original"
                    }
                ]
            }
            
            Provide at least 5-8 creative alternatives across different categories.
            All information must be accurate and current for the Indian market.
            Prices should be in Indian Rupees with realistic ranges."""
            
            user_prompt = f"Find comprehensive information and alternatives for: {item_name}"
            
            response = self.client.models.generate_content(
                model="gemini-2.5-pro",
                contents=[
                    types.Content(role="user", parts=[types.Part(text=user_prompt)])
                ],
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    response_mime_type="application/json",
                    temperature=0.7,
                ),
            )
            
            if response.text:
                try:
                    result = json.loads(response.text)
                    logging.info(f"Successfully parsed Gemini response for {item_name}")
                    return result
                except json.JSONDecodeError as e:
                    logging.error(f"Failed to parse JSON response: {e}")
                    logging.error(f"Raw response: {response.text}")
                    return None
            else:
                logging.error("Empty response from Gemini")
                return None
                
        except Exception as e:
            logging.error(f"Error getting item details: {str(e)}")
            return None
    
    def get_detailed_comparison(self, original_item: str, alternative_item: str) -> Optional[Dict[str, Any]]:
        """Get detailed comparison between original and alternative items"""
        try:
            system_prompt = """You are an expert product comparison analyst. 
            Provide a detailed side-by-side comparison of two items.
            
            Response format (JSON):
            {
                "original": {
                    "name": "original item name",
                    "description": "detailed description",
                    "pros": ["list of advantages"],
                    "cons": ["list of disadvantages"],
                    "price_inr": "price in INR",
                    "availability": "availability status",
                    "performance_score": "score out of 10",
                    "use_cases": ["primary use cases"],
                    "compatibility": "compatibility information"
                },
                "alternative": {
                    "name": "alternative item name",
                    "description": "detailed description",
                    "pros": ["list of advantages"],
                    "cons": ["list of disadvantages"],
                    "price_inr": "price in INR",
                    "availability": "availability status",
                    "performance_score": "score out of 10",
                    "use_cases": ["primary use cases"],
                    "compatibility": "compatibility information"
                },
                "comparison": {
                    "cost_difference": "cost comparison analysis",
                    "performance_difference": "performance comparison",
                    "availability_difference": "availability comparison",
                    "compatibility_analysis": "compatibility analysis",
                    "recommendation": "which is better and why",
                    "key_differences": ["list of key differences"]
                }
            }
            
            Provide accurate information for the Indian market with realistic prices in INR."""
            
            user_prompt = f"Compare these two items in detail: '{original_item}' vs '{alternative_item}'"
            
            response = self.client.models.generate_content(
                model="gemini-2.5-pro",
                contents=[
                    types.Content(role="user", parts=[types.Part(text=user_prompt)])
                ],
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    response_mime_type="application/json",
                    temperature=0.7,
                ),
            )
            
            if response.text:
                try:
                    result = json.loads(response.text)
                    logging.info(f"Successfully parsed comparison for {original_item} vs {alternative_item}")
                    return result
                except json.JSONDecodeError as e:
                    logging.error(f"Failed to parse JSON comparison response: {e}")
                    logging.error(f"Raw response: {response.text}")
                    return None
            else:
                logging.error("Empty comparison response from Gemini")
                return None
                
        except Exception as e:
            logging.error(f"Error getting detailed comparison: {str(e)}")
            return None
