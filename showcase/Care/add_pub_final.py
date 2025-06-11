#!/usr/bin/env python3
"""
Final script to convert CARE-v3.xlsx to publications_data.js format
Preserves original organ and task content without any mapping
Places new publications at the beginning of const publicationsData array
"""

import pandas as pd
import re

def clean_text(text):
    """Clean and escape text for JavaScript"""
    if pd.isna(text) or text == '':
        return ''
    
    # Convert to string and clean
    text = str(text).strip()
    
    # Escape quotes and special characters for JavaScript
    text = text.replace('\\', '\\\\')  # Escape backslashes first
    text = text.replace('"', '\\"')    # Escape double quotes
    text = text.replace("'", "\\'")    # Escape single quotes
    text = text.replace('\n', '\\n')   # Escape newlines
    text = text.replace('\r', '\\r')   # Escape carriage returns
    text = text.replace('\t', '\\t')   # Escape tabs
    
    return text

def create_publication_js_object(row):
    """Create a JavaScript object string for a publication"""
    
    # Clean and prepare all fields - preserve original content
    title = clean_text(row.get('Title', ''))
    publication = clean_text(row.get('Publication', ''))
    year = str(int(row.get('Year', 2024))) if pd.notna(row.get('Year')) else '2024'
    application = clean_text(row.get('Application', ''))
    organ = clean_text(row.get('Organ', ''))  # 保留原始organ内容
    methodology = clean_text(row.get('Methodology', ''))
    data = clean_text(row.get('Data', ''))
    main_results = clean_text(row.get('Main Results', ''))
    tasks = clean_text(row.get('Tasks', '')) if pd.notna(row.get('Tasks')) and row.get('Tasks') != '' else 'classification'  # 保留原始tasks内容
    
    # Create the JavaScript object string
    js_object = f"""    {{
        title: "{title}",
        publication: "{publication}",
        year: "{year}",
        application: "{application}",
        organ: "{organ}",
        methodology: "{methodology}",
        data: "{data}",
        mainResults: "{main_results}",
        tasks: "{tasks}"
    }}"""
    
    return js_object

def main():
    try:
        # Read the Excel file
        print("Reading Excel file CARE-v3.xlsx...")
        df = pd.read_excel('CARE-v3.xlsx')
        
        print(f"Found {len(df)} total publications in Excel file")
        print("Columns:", list(df.columns))
        
        # Show first few rows to understand the data structure
        print("\nFirst 3 rows preview:")
        for i in range(min(3, len(df))):
            row = df.iloc[i]
            print(f"Row {i+1}:")
            print(f"  Title: {row.get('Title', 'N/A')}")
            print(f"  Organ: {row.get('Organ', 'N/A')}")
            print(f"  Tasks: {row.get('Tasks', 'N/A')}")
            print()
        
        # Read the current publications_data.js file
        print("Reading current publications_data.js file...")
        with open('publications_data.js', 'r', encoding='utf-8') as f:
            current_content = f.read()
        
        # Find the position to insert new publications (after const publicationsData = [)
        pattern = r'const\s+publicationsData\s*=\s*\['
        match = re.search(pattern, current_content)
        if not match:
            print("Error: Could not find 'const publicationsData = [' in publications_data.js")
            return
        
        insert_position = match.end()
        print(f"Found insertion position at character {insert_position}")
        
        # Generate JavaScript objects for all publications from Excel
        new_publications = []
        for index, row in df.iterrows():
            try:
                js_obj = create_publication_js_object(row)
                new_publications.append(js_obj)
                title_preview = clean_text(row.get('Title', ''))[:50]
                organ_preview = clean_text(row.get('Organ', ''))
                tasks_preview = clean_text(row.get('Tasks', ''))
                print(f"Processed {index + 1}: {title_preview}... | Organ: {organ_preview} | Tasks: {tasks_preview}")
            except Exception as e:
                print(f"Error processing row {index}: {e}")
                continue
        
        # Create the new content to insert at the beginning
        if new_publications:
            # Add new publications at the beginning with proper formatting
            new_content = '\n' + ',\n'.join(new_publications)
            
            # Check if there are existing publications after the array declaration
            # Look for existing content after the opening bracket
            remaining_content = current_content[insert_position:].strip()
            if remaining_content and not remaining_content.startswith(']'):
                # There are existing publications, add comma after new ones
                new_content += ','
            
            # Insert the new publications at the beginning of the array
            updated_content = (
                current_content[:insert_position] + 
                new_content + 
                current_content[insert_position:]
            )
            
            # Write the updated file
            with open('publications_data.js', 'w', encoding='utf-8') as f:
                f.write(updated_content)
            
            print(f"\n=== Success ===")
            print(f"Successfully added {len(new_publications)} publications to the beginning of publications_data.js")
            print(f"Original file size: {len(current_content)} characters")
            print(f"New file size: {len(updated_content)} characters")
            print(f"Added {len(updated_content) - len(current_content)} characters")
            
            print("\nFirst 5 publications added to the beginning:")
            for i in range(min(5, len(df))):
                row = df.iloc[i]
                print(f"  {i+1}. {clean_text(row.get('Title', ''))}")
                print(f"     Organ: {clean_text(row.get('Organ', ''))}")
                print(f"     Tasks: {clean_text(row.get('Tasks', ''))}")
        else:
            print("No publications to add")
            
    except FileNotFoundError as e:
        if 'CARE-v3.xlsx' in str(e):
            print("Error: CARE-v3.xlsx file not found")
            print("Please make sure the Excel file is in the same directory as this script")
        elif 'publications_data.js' in str(e):
            print("Error: publications_data.js file not found")
            print("Please make sure the JavaScript file exists")
        else:
            print(f"Error: File not found - {e}")
    except ImportError:
        print("Error: pandas library not found")
        print("Please install pandas: pip install pandas")
        print("Or use add_pub_simple.py for a version without pandas dependency")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
