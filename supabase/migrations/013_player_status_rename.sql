-- Rename Reserve -> Missing; migrate removed Free Agent status to Active
update roster_players set status = 'Missing' where status = 'Reserve';
update roster_players set status = 'Active' where status = 'Free Agent';
