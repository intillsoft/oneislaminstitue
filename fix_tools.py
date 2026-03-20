import sys

filepath = sys.argv[1]

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = 'opacity-0 group-hover/block:opacity-100 transition-all flex items-center gap-1.5 z-20 bg-black/80 backdrop-blur-xl p-1'

if target in content:
    replacement = 'opacity-0 group-hover/block:opacity-100 transition-all flex items-center gap-1 z-20 bg-black/80 backdrop-blur-xl p-1'
    print("Found! Splitting")
    
    # Let's find exactly the line and insert the absolute options logic
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'opacity-0 group-hover/block:opacity-100' in line and 'flex items-center gap-1.5' in line:
            print(f"Match on line {i+1}")
            # replace gap-1.5 with gap-1
            lines[i] = line.replace('gap-1.5', 'gap-1')
            
            # Now insert the layout items right after that line opening
            # Find indentation
            indent = line.split('<div')[0]
            
            logic = """{/* Width Options Presets for quick snap Cinema native Stream frame setup */}
<div className="flex items-center border-r border-emerald-500/10 pr-1 gap-0.5">
    {WIDTH_OPTIONS.map(opt => (
        <button 
            key={opt.value}
            title={opt.label}
            onClick={() => updateBlock(block.id, { layoutSettings: { ...(block.layoutSettings || {}), width: opt.value } })}
            className={`p-1.5 rounded-lg transition-all ${block.layoutSettings?.width === opt.value ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-emerald-400'}`}
        >
            <Icon name={opt.icon} size={10} />
        </button>
    ))}
</div>"""
            # indent every line of logic
            indented_logic = '\n'.join([f"{indent}      {l}" for l in logic.split('\n')])
            lines[i] = lines[i] + '\n' + indented_logic
            break
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print("Success")
else:
    print("Not found target string")

