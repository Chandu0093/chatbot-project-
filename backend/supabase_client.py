from supabase import create_client, Client
import os

# Load from environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your-anon-or-service-key")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
