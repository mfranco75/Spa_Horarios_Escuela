import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ksiyrzymdgkmzuyxeuqv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaXlyenltZGdrbXp1eXhldXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwNDU0NzksImV4cCI6MjA0OTYyMTQ3OX0.MbzoakNLETEEwgFok1e6ADVsWRle5382Q3JiiEnYgCQ'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
