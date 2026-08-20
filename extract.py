import codecs
with open('scratch/App_d757814.tsx', 'rb') as f:
    raw = f.read()
text = raw.decode('utf-16')
lines = text.splitlines()

s = -1
for i, l in enumerate(lines):
    if 'type DonTrangThai = ' in l: s = i
e = s
if s != -1:
    while e < len(lines):
        if 'const PanelLienThong =' in lines[e]: break
        e += 1
    while e < len(lines):
        if lines[e].startswith('}'):
            e += 1
            break
        e += 1

out = open('app/components/TiepNhanDonLienThong.tsx', 'w', encoding='utf-8')
out.write('import React, { useState, useEffect, useMemo } from "react";\n')
out.write('import { Search, ChevronDown, Check, ArrowRight, UserPlus, FolderOpen, ArrowDownToLine, MoreHorizontal, Inbox, List, RefreshCw, X, ChevronRight, Share2, CornerUpLeft, Plus, Download, ChevronLeft, Eye, MessageSquare, AlertCircle, FileText, CheckCircle2, FileUp, Send, Loader2, ArrowRightCircle } from "lucide-react";\n')
out.write('import { DON_SAMPLE, type DonTiepNhan, type DonTrangThai } from "../App";\n')
out.write('import { Select } from "./ui/select";\n')
out.write('import { Button } from "./ui/button";\n')
out.write('import { Input } from "./ui/input";\n')
out.write('import { Badge } from "./ui/badge";\n')
out.write('import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";\n')
out.write('import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";\n')
out.write('import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";\n')
out.write('import { format, isAfter, isBefore, isSameDay } from "date-fns";\n')
out.write('\n'.join(lines[s:e]))
out.write('\nexport default PanelLienThong;\n')
out.close()
print('Success')
