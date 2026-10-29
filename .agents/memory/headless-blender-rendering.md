---
name: Headless Blender rendering
description: Blender rendering behavior in this headless Replit environment.
---

Use Blender's Cycles CPU renderer for image renders. Eevee fails in this environment because it needs a GLX/OpenGL context.

**Why:** the rendering environment has no available GLX context, but Blender's CPU renderer works without one.

**How to apply:** when creating a still image or fallback poster from a Blender model, select Cycles and set the device to CPU.
