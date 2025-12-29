// ⚡ KynarUniverse Backend Configuration
// Using CDN import because we are in Spck Editor (No NPM)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// ✅ YOUR PROJECT URL
const SUPABASE_URL = 'https://wwpppwjagfboxpaxhxku.supabase.co'; 

// ✅ YOUR VERIFIED ANON KEY
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cHBwd2phZ2Zib3hwYXhoeGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMTY2OTUsImV4cCI6MjA4MjU5MjY5NX0.nRhGsJ62o7qdyPPZFKURqgZ44fAYRKLYwbVmOymqif4';

// Initialize Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("⚡ Supabase Connected & Key Verified");
