-- Update webinar status from "upcoming" to "completed" when past scheduled date/time
-- This script should be run periodically or as a trigger

-- Function to update webinar status and user registrations
CREATE OR REPLACE FUNCTION update_webinar_status()
RETURNS void AS $$
BEGIN
  -- First, update user registrations for completed webinars
  UPDATE user_webinars 
  SET 
    status = 'completed',
    attended_at = NOW()
  WHERE 
    status = 'registered'
    AND webinar_id IN (
      SELECT id FROM webinars 
      WHERE status = 'upcoming' 
      AND (
        scheduled_date < CURRENT_DATE 
        OR (
          scheduled_date = CURRENT_DATE 
          AND scheduled_time < CURRENT_TIME
        )
      )
    );

  -- Then, update webinars that are past their scheduled date/time to "completed"
  UPDATE webinars 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE 
    status = 'upcoming' 
    AND (
      scheduled_date < CURRENT_DATE 
      OR (
        scheduled_date = CURRENT_DATE 
        AND scheduled_time < CURRENT_TIME
      )
    );
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update status when date/time changes
CREATE OR REPLACE FUNCTION trigger_update_webinar_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If the webinar is being updated and the scheduled date/time is in the past
  IF NEW.status = 'upcoming' AND (
    NEW.scheduled_date < CURRENT_DATE 
    OR (
      NEW.scheduled_date = CURRENT_DATE 
      AND NEW.scheduled_time < CURRENT_TIME
    )
  ) THEN
    NEW.status := 'completed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS update_webinar_status_trigger ON webinars;

-- Create the trigger
CREATE TRIGGER update_webinar_status_trigger
  BEFORE INSERT OR UPDATE ON webinars
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_webinar_status();

-- Update existing webinars that are already past their scheduled date/time
SELECT update_webinar_status();

-- Add a comment to explain the function
COMMENT ON FUNCTION update_webinar_status() IS 'Updates webinar status from upcoming to completed when past scheduled date/time';
