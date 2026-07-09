
-- Fix: Allow students to see technician profiles (needed for the join to show technician name)
CREATE POLICY "Students can view technician profiles for their requests"
ON public.profiles
FOR SELECT TO authenticated
USING (
  id IN (
    SELECT sr.technician_id FROM public.service_requests sr
    WHERE sr.student_id IN (
      SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid()
    )
    AND sr.technician_id IS NOT NULL
  )
);

-- Drop the overly permissive select policy on service_requests
DROP POLICY IF EXISTS "Students can view own requests" ON public.service_requests;

-- Recreate: Students see own, Admins see all, Technicians see only assigned
CREATE POLICY "Users can view relevant requests"
ON public.service_requests
FOR SELECT TO authenticated
USING (
  (student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  OR has_role(auth.uid(), 'Admin'::app_role)
  OR (has_role(auth.uid(), 'Technician'::app_role) AND technician_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);
