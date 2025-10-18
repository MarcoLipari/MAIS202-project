# Data Folder

This directory contains all data used in the project.

## Structure

- `sampled_comments/` — processed and cleaned datasets ready for analysis.
- `commentcleaner` — bash script used to clean the raw data.
- `ba051999301b109eab37d16f027b3f49ade2de13.torrent` - torrent file to access raw data. See https://academictorrents.com/details/ba051999301b109eab37d16f027b3f49ade2de13

## Notes

- Each `.csv` file in `sampled_comments/` contains, by month from 2005-12 to 2024-12:
    - `subreddit` — name of the subreddit the comment belongs to.
    - `subreddit_id` — unique Reddit identifier for the subreddit.
    - `body` — text of the Reddit comment.
    - `date_created_utc` — timestamp (in UTC) representing when the comment was created.
