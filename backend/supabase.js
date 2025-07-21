const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lnppznvfdhqehnmulxrs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxucHB6bnZmZGhxZWhubXVseHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA5OTgxNSwiZXhwIjoyMDY4Njc1ODE1fQ.RdNLlXt_7QoWObXiyLa-mc93vpXxPNd7ksj2LPLXOx4';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase }; 