import json
import random
import re
import logging
from typing import Dict, Any, List, Tuple

logger = logging.getLogger("uvicorn")

class Chatbot:
    def __init__(self, responses_path: str):
        """Initialize chatbot with responses from JSON file"""
        self.responses = {}
        self.responses_path = responses_path
        self.load_responses()
    
    def load_responses(self):
        """Load responses from JSON file"""
        try:
            with open(self.responses_path, 'r', encoding='utf-8') as f:
                self.responses = json.load(f)
            logger.info(f"✅ Loaded responses from {self.responses_path}")
        except FileNotFoundError:
            logger.error(f"❌ Responses file not found at {self.responses_path}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"❌ Invalid JSON in responses file: {e}")
            raise
        except Exception as e:
            logger.error(f"❌ Error loading responses: {e}")
            raise
    
    def get_response(self, message: str) -> str:
        """Get appropriate response for the given message"""
        if not message or not message.strip():
            return "Please send me a message!"
        
        message_lower = message.lower().strip()
        
        # Check each category for pattern matches
        for category, data in self.responses.items():
            if category == "default":
                continue
                
            patterns = data.get("patterns", [])
            for pattern in patterns:
                # Simple pattern matching
                if self._matches_pattern(pattern, message_lower):
                    responses = data.get("responses", [])
                    if responses:
                        response = random.choice(responses)
                        logger.info(f"🤖 Matched category '{category}' with pattern '{pattern}'")
                        return response
        
        # Default response if no pattern matches
        default_responses = self.responses.get("default", {}).get("responses", [
            "I'm not sure how to respond to that. Can you try rephrasing?",
            "Interesting! Tell me more about that.",
            "I'm still learning. Can you ask something else?"
        ])
        default_response = random.choice(default_responses)
        logger.info("🤖 Using default response")
        return default_response
    
    def _matches_pattern(self, pattern: str, message: str) -> bool:
        """Check if message matches the pattern"""
        pattern_lower = pattern.lower()
        
        # Exact match for short patterns
        if len(pattern_lower) <= 3:
            return pattern_lower in message
        
        # Word boundary match for longer patterns
        try:
            return re.search(r'\b' + re.escape(pattern_lower) + r'\b', message) is not None
        except re.error:
            # Fallback to simple substring match if regex fails
            return pattern_lower in message
    
    def get_categories(self) -> List[str]:
        """Get list of available response categories"""
        return list(self.responses.keys())
    