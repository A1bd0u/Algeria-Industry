import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# find {/* Tender Form Modal */} and {/* Ad Space Request Form Modal */}
start_str = "{/* Tender Form Modal */}"
end_str = "{/* Ad Space Request Form Modal */}"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + content[end_idx:]
    with open('src/pages/Dashboard.tsx', 'w') as f:
        f.write(new_content)
    print("Deleted successfully")
else:
    print("Could not find boundaries")
