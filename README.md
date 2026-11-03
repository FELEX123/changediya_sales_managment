# Changediya prescription and delivery desk

Patient upload: `/`. Protected staff desk: `/pharmacy`.

Required patient fields: name, 10-digit Indian mobile number, complete street address, delivery area (Savedi / Ahilya Nagar / Khedgaon), prescription and consent. Optional landmark and notes. Supports 5 files, 15 MB original total, maximum 15 rendered pages. Originals and printable JPEG pages are stored in private R2; D1 stores requests. File downloads require a staff cookie. No public patient listing.

## Staff access
Set `PHARMACY_KEY` as a runtime secret. Staff enter it on `/pharmacy`; an HttpOnly, Secure, SameSite=Strict cookie lasts 12 hours. Rotate the secret to revoke all sessions. Do not put the secret in the repository or a URL. Site access remains private until the owner changes the site's audience. The patient form must be made public before sharing with patients; staff APIs remain separately protected.

## Printing
The desk polls for new records. Enable the automatic station only on the printer-connected computer. Only one station should be enabled. Chrome must be launched with `--kiosk-printing` for silent printing; otherwise a standard browser print dialog appears. Set default printer, A4 paper and no browser headers/footers, then test with a non-patient sample. Keep computer awake and desk open. Cookie expiry requires signing in again. This is a browser print station, not a background Windows service.

Every print document includes a cover with all entered patient data and delivery zone followed by every rendered prescription page. A conditional D1 update claims queued requests once before starting print. `sent` means a print attempt, not physical confirmation; staff select `printed` after verifying output. Requeue explicitly for a failed attempt. Auto station pauses on refresh; queued records persist. Printer hardware is not discoverable or testable from the hosted site.

## Delivery
Filter by area; open request to assign partner and change status through printed, preparing, out for delivery and completed. No messages are sent automatically and uploads do not confirm a medicine order.

## Development
Install using the Sites dependency helper. `pnpm db:generate` appends schema migrations. Type check: `node node_modules/typescript/bin/tsc --noEmit`. Build through the Sites build helper. Runtime requires D1 `DB`, R2 `BUCKET` and secret `PHARMACY_KEY`. Local test variables belong in ignored `.dev.vars`. Never use real patient information for QA.
