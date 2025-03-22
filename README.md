# KQL Library 

A sleek, modern web application for organizing and searching your KQL (Kusto Query Language) queries. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🗂️ Organize queries by category and subcategory
- 🔍 Search functionality across titles, descriptions, and tags
- 📋 One-click copy button for quick query access
- 🎨 Custom Dracula-inspired color theme
- 📱 Responsive design for all devices

## Color Scheme 🎨

The application uses a custom Dracula-inspired color theme:

| Color | Hex Code | Applied To |
|-------|----------|------------|
| Purple | `#bd93f9` | Main category button text |
| Pink | `#ff79c6` | Subcategory button text |
| Green | `#50fa7b` | Card titles; Copy button success state |
| Orange | `#ffb86c` | Card descriptions/subtitles |
| Cyan | `#8be9fd` | Button focus rings; Selected button outlines; Tag text; Copy button default state |
| Dark Gray | `#282a36` | Background (via Tailwind's gray-950) |
| Medium Gray | `#44475a` | Card backgrounds, button backgrounds (via Tailwind's gray-900, gray-800) |

### Color Applications

- **Main Categories**: Purple text (`#bd93f9`) on dark gray background
- **Subcategories**: Pink text (`#ff79c6`) on dark gray background
- **Selected State**: Cyan outline (`#8be9fd`) around the selected button
- **Card Titles**: Green text (`#50fa7b`) 
- **Card Descriptions**: Orange text (`#ffb86c`)
- **Query Tags**: Cyan text (`#8be9fd`) on dark gray pills
- **Copy Button**: 
  - Default: Cyan text and icon
  - After copying: Green text and icon with animation

## Query File Structure

Each category has its own JSON file with the following structure:

```json
[
  {
    "title": "Query Title",
    "description": "Query description",
    "query": "YourKQLQueryHere",
    "category": "Category Name",
    "subCategory": "Subcategory Name",
    "tags": ["tag1", "tag2", "tag3"]
  }
]
```
