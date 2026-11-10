# Portfolio review · Projects
Reviewed November 7, 2026, at http://localhost:3000/#projects. Suggested repository location: docs/PROJECTS_IMPROVEMENTS.md.

## Fix the return trip first

- [ ] **Restore the selected project when returning from detail.** Start on WireTrace, press Next, open FaceTracekr, then use All projects. The gallery returns to WireTrace. Carry the project slug through the return link or navigation state and use it to initialize both the selection and scroll position. Restore focus to the selected case-study link for keyboard users.
  - **Pass:** returning from FaceTracekr shows its print, heading, selected indicator and detail link together. Test All projects and browser Back separately. A fresh visit to /#projects still has a sensible default.

## Give the project pages something to show

- [ ] **Finish one case study before polishing the transitions.** On the inspected FaceTracekr page, the introductory sentence appears twice and all four entries under My contribution, Design decision, Observed result and Next step show a dash. Render entries only when populated. Replace the repeated introduction with one concrete design decision. John could describe how he distinguishes an intentional wink from an ordinary blink, what he observed in calibration and what he wants to test next. Confirm the details with him.
  - **Pass:** the page contains a specific contribution and supporting evidence. Unfilled fields occupy no space. Measured results include the actual test conditions.
- [ ] **Make the first print demonstrate WireTrace.** The current cover is a breadboard illustration with a chip marked SIGNAL. Use a capture of a real circuit from the visualizer, ideally showing the selected net and its connected pins. Keep the ivory frame and cobalt accent. Move the project name into one clear caption in place of the repeated title and study number. Keep any illustrative media labeled accurately until replaced.
  - **Pass:** a visitor can see what WireTrace helps them do before opening its case study. The source pins and destination remain legible on a phone.
- [ ] **Give each subsequent project its own evidence.** For FaceTracekr, use a short consented capture of the cursor and tracking overlay responding to a deliberate gesture. For Humline, pair an original hummed phrase with its MIDI playback and show the corresponding notes. Supply a still and caption for both. Audio starts on request.

## Refine the carousel in the narrow layout

- [ ] **Move the controls beside the print.** In the reviewed viewport the next card peeks in on the right, a horizontal scrollbar sits beneath the art, and the title, description and Explore project link consume the remaining height. The named Previous/Next controls come later in reading order. Put a compact “1 of 3” and both arrows immediately under the print; tighten the space from the section heading to the art. Keep horizontal swipe and vertical page scrolling independent.
  - **Pass:** on a 390 px phone, the visible controls identify the current project and offer a clear next action. A keyboard user can select a project and open it without scrolling through decorative elements.
- [ ] **Connect the movement to the circuit.** On wide screens, keep the current print face-on and rotate its neighbors on a shallow arc. Advance a single cobalt highlight along the rim as the next print comes forward. Stop the motion as soon as it lands. On narrow screens, keep the existing horizontal gallery. With reduced motion, change selection immediately.
  - **Pass:** repeated Next/Previous actions leave exactly one selected print, with the matching title and link. Selecting a card never captures vertical scroll.

## Before publishing

- [ ] Open the visible red “1 Issue” development indicator and diagnose its message. Its cause was not established in this review. Verify the production build separately.
- [ ] Replace editorial reminders such as “project captures to follow” when final media is available. Check the footer’s development-preview label and the Goals instruction about choosing a payload. Use John’s own next experiment as public copy.
- [ ] Keep the existing chapter anchors, accessible names on gallery controls, repository link and visible project summary. Check the result at a wide desktop width, on touch hardware and with reduced motion enabled.

**Review coverage.** Direct entry at the Projects anchor, the narrow browser presentation, Next project, the FaceTracekr detail page and its All projects return link were inspected live. Wide-screen animation, touch gestures, browser Back, screen readers and production behavior remain verification tasks.
