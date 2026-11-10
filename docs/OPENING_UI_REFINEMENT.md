# Opening UI refinement handoff for the local redesign

## Verified context

Repository folder: C:\Users\johnb\the-john-man.github.io
Origin: https://github.com/The-John-Man/the-john-man.github.io.git
Local branch: website-rebuild
Recorded branch commit: e960357ef2740337204bcd66868ac5716ee689a1

At review time, .git/HEAD points to website-rebuild. The local working files differ from the GitHub snapshot at that commit. In particular, local app/page.tsx renders the opening and closing, with separate chapter routes. The older pushed snapshot embeds the four chapters in the homepage.

Use the actual checked-out working tree as the implementation baseline. Inspect git status and the local diff before editing so the current redesign work is preserved. GitHub's open-PR query returned no entries at review time. Confirm any PR association from the actual checkout if needed.

## Goal and scope

Improve the visual quality of the existing circuit-board opening for a reusable portfolio template. Prioritize camera direction, physical depth and the final navigation composition.

Use the current ivory, graphite and cobalt theme. Keep the current chapter destinations and meaningful HTML labels. Limit edits to the opening component, directly supporting styles and a focused regression check when the existing coverage is insufficient.

The notebook, experience layout, project gallery and Goals wave already show a consistent visual language in the recording. Their redesign is outside this pass.

## Evidence from the recording

The supplied recording is 40 seconds long, recorded at 1920×1140, showing localhost:3002. It includes the opening, forward and reverse scrolling, separate /about, /experience, /projects and /goals pages, notebook tab changes and project selection.

The opening begins with John Manuel at the left and the enlarged chip and wire at the right. The scene moves toward an overhead view while the signal advances. During the sequence the chip remains a dominant object and the viewpoint gives limited sense of traveling along the wire. The materials are simple flat surfaces and layered strokes. At the final overhead view the contact labels are small, and continued scrolling takes the board toward the closing section.

These observations identify design opportunities. The recording does not establish an exact frame-rate measurement or prove a navigation-clipping defect. Reproduce the final pose at rest before changing its framing.

The recording shows a more recent local presentation than the GitHub branch snapshot. Preserve that newer work.

## Apply only the relevant PDF advice

The Interactive 3D Website Guide by @designedby.russ is useful here for four principles.

- Pages 5 and 9 describe explicit scroll cues. Use these to give each stage a distinct framing and direction.
- Page 8 describes lighting and contrast. Apply them to the jumper's cross-section, shadow and its attachment to the board.
- Page 11 recommends readable HTML labels. Use it to improve the directory's arrival composition.
- Pages 12–14 describe rendering and responsive checks. Preserve the current lightweight behavior while checking the modified scene.

The guide's framework list, video-generation workflow, teardown animation and promotional filming instructions are unnecessary for this task.

## Implementation targets

### 1. Make the viewpoint follow the conductor

Use four compositional cues as a starting point. Adjust their ranges to suit the actual local scroll stage.

| Progress | Intended view |
| --- | --- |
| 0–18% | The name is readable and the signal's origin is obvious near the chip. |
| 18–52% | The frame follows the signal along the trace toward the bend. Let the chip move toward the edge as attention shifts. |
| 52–78% | The viewpoint rises beside the jumper while enough board remains visible below to establish height. |
| 78–90% | Pull back into the final four-contact composition and settle. |
| 90–100% | Hold that final pose through a short, ordinary scroll interval before the opening leaves the screen. |

The pulse's route position should guide the framing. Keep the path ahead visible so the visitor can anticipate the destination. Use a stable horizon, smooth reversible progress and a settled final view. The rest interval should have a clear path onward and should not trap scroll input.

Inspect the actual projection in app/components/intro.tsx. Its yaw, pitch, scale and center changes already create a basis for movement. Decide whether a moving world-space focal point and revised framing can deliver the desired journey within that renderer.

### 2. Improve a few important physical cues

- Give the insulated jumper a round cross-section through coherent highlight and shade.
- Improve the relationship between its height and the shadow on the board.
- Give both wire ends a plausible pad or solder connection.
- Refine the chip's thickness and prominent leads.
- Keep secondary circuitry subdued and the title area quiet.

Use the existing renderer for the first implementation. If its projection or shading imposes a material limitation, demonstrate the specific problem with matched frames and propose the smallest renderer or asset change that resolves it. Any larger 3D alternative needs a visible benefit and a measured loading/performance cost.

### 3. Land on usable navigation

At the final pose, fit all four contacts and their HTML labels comfortably within the available viewport. Increase their readable scale in proportion to the board. Maintain alignment while resizing and while the scroll direction reverses. Make keyboard focus and link hit areas clear.

Retain the current separate chapter routes and their board-return behavior. Inspect reduced-motion and mobile layouts on their own terms. A narrow screen can use a stable, simpler arrangement.

## Files to inspect first

- app/components/intro.tsx
- Relevant intro, canvas, fallback and directory rules in app/globals.css
- app/tokens.css for existing shared values
- app/page.tsx and app/layout.tsx for the current navigation structure
- Existing intro, reverse-scroll and fallback checks in tests/portfolio.spec.ts

## Review the result

Compare the starting pose, trace-following pose, jumper crossing and settled directory before and after at the same viewport dimensions. Inspect 1440×900 and 390×844, plus a width around the current mobile breakpoint. Check a rapid forward/back reversal and a resize during the intro.

Run the existing applicable checks. Report visual changes, actual validation results and any remaining limitation. Keep claims about smoothness tied to observation or measurement.

## Instruction for the VS Code agent

Read this brief and inspect the local working tree on website-rebuild. Implement the focused opening refinement using the recording as the visual baseline. Preserve local redesign work, separate chapter routes and existing interactions. Begin with camera framing and the final directory pose, then refine physical depth. Show matched before/after views and report the checks performed.

