Market List — automatic app icon + splash for Android builds
===============================================================

Your repo doesn't commit an android/ folder — your GitHub Actions workflow
creates it fresh from Capacitor's default template on every run, which is
why the APK has been showing the default icon: there was never a custom
one for it to pick up.

This fix uses Capacitor's own asset-generation tool (@capacitor/assets)
instead of committing generated platform code, so it fits how your repo
already works.

WHAT TO DO
----------
1. Copy the "resources" folder into your repo root (same level as
   capacitor.config.ts). It contains:
     icon.png             1024x1024 flat icon (legacy/fallback)
     icon-foreground.png  1024x1024 transparent basket, adaptive-icon layer
     icon-background.png  1024x1024 flat cream (#FDF6E5), adaptive-icon layer
     splash.png           2732x2732 cream bg + centered basket
     splash-dark.png      same as splash.png for now (no dark theme yet)

2. Replace .github/workflows/android.yml with the copy in this zip — it
   adds one step, right after "Add Android platform":

       - name: Generate app icon & splash screen
         run: npx @capacitor/assets generate --android

   This runs after `cap add android` creates a fresh platform folder each
   build, and writes all the correctly-sized mipmap/drawable files from
   your resources/ images before the APK is compiled.

3. Commit and push both. Next run of the Build Android APK workflow will
   produce an APK with your basket icon and cream splash screen instead
   of the Capacitor default.

Nothing else about your workflow changes — android/ still isn't committed,
still gets rebuilt fresh every run, it just now gets branded automatically
as part of that rebuild.

Want the same for iOS too? Add `--ios` (or drop the platform flag to do
both) to that generate step once an ios/ platform exists in the workflow.
