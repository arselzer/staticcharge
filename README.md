personal-project-report
=======================

## What?

This is a bit of school work, which ended up as a Markdown rendering
framework.

It was originally a fork of my chemistry homework onepage app, which
ended up as a HTML mess, but I converted it into a singlepage scroll
app, which renders markdown files intelligently.

## Structure

`config.json` can toggle the default bibliography on and off, and defines the page's title.
When activated, it takes
[Citationer](https://github.com/AlexanderSelzer/Citationer)
input. Also, it defines the title of the page.

Example:

```json
{
  "title": "Personal Project Report",
  "bibliography": false
}
```

`app/content/` is the place of storage for all source markdown files.

There are two special files: `title.md`, and `contents.md`

They have special stylesheet rules, and get rendered as the first
and second pages in the whole site.

Files named `1.md` and `2.md` - `[number].md` contain the main content.

They will be sorted and rendered in expected order behind the special pages.

One file corresponds to one page, however <hr> line breaks, written in markdown as:

```markdown
------------

************
```

split the file into more pages.

## Usage

### dependencies

Gulp is needed for building the page.

To install: `sudo npm install -g gulp`