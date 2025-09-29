import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ChevronRightIcon, FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import { useState } from "react";

export interface TreeItem {
  label: string;
  value?: string;
  children?: TreeItem[];
}

interface TreeViewProps {
  data: TreeItem[];
  value: string | null;
  onSelect: (value: string) => void;
}

export const TreeView = ({ data, value, onSelect }: TreeViewProps) => {
  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="w-full bg-background/50 backdrop-blur-sm border-r border-border/50">
        <SidebarContent className="p-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {data.map((item, index) => (
                  <Tree
                    key={index}
                    item={item}
                    selectedValue={value}
                    onSelect={onSelect}
                    parentPath=""
                    level={0}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail className="bg-border/30" />
      </Sidebar>
    </SidebarProvider>
  );
};

interface TreeProps {
  item: TreeItem;
  selectedValue: string | null;
  onSelect?: (value: string) => void;
  parentPath: string;
  level: number;
}

const Tree = ({ item, selectedValue, onSelect, parentPath, level }: TreeProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const currentPath = parentPath ? `${parentPath}/${item.label}` : item.label;
  const isSelected = selectedValue === currentPath;
  const hasChildren = item.children && item.children.length > 0;
  
  // Indentation based on nesting level
  const indentClass = level > 0 ? `pl-${Math.min(level * 4, 12)}` : "";
  
  // File extension detection for better icons
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return <FileIcon className={`h-4 w-4 ${getFileIconColor(ext)}`} />;
  };
  
  const getFileIconColor = (ext?: string) => {
    switch (ext) {
      case 'tsx':
      case 'jsx': return 'text-blue-500';
      case 'ts':
      case 'js': return 'text-yellow-500';
      case 'css': return 'text-pink-500';
      case 'json': return 'text-green-500';
      case 'md': return 'text-purple-500';
      default: return 'text-muted-foreground';
    }
  };

  // Leaf node = file
  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isSelected}
          className={`
            group relative transition-all duration-200 ease-out
            hover:bg-primary/10 hover:text-foreground hover:shadow-sm
            data-[active=true]:bg-primary/20 data-[active=true]:text-primary-foreground
            data-[active=true]:shadow-md data-[active=true]:border-l-2 data-[active=true]:border-primary
            rounded-lg ${indentClass}
          `}
          onClick={() => onSelect?.(currentPath)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center gap-2 w-full text-black dark:text-white">
            {getFileIcon(item.label)}
            <span className={`
              truncate transition-all duration-200
              ${isSelected ? 'font-medium' : 'font-normal'}
              ${isHovered ? 'translate-x-1' : ''}
            `}>
              {item.label}
            </span>
          </div>
          
          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute right-2 h-2 w-2 bg-primary rounded-full animate-pulse" />
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Folder with children
  return (
    <SidebarMenuItem>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="group/collapsible"
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={`
              group relative transition-all duration-200 ease-out
              hover:bg-muted/80 hover:shadow-sm rounded-lg ${indentClass}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center gap-2 w-full">
              <ChevronRightIcon 
                className={`
                  h-4 w-4 transition-all duration-300 ease-out
                  ${isOpen ? 'rotate-90 text-primary' : 'text-muted-foreground'}
                  ${isHovered ? 'scale-110' : ''}
                `} 
              />
              {isOpen ? (
                <FolderOpenIcon className="h-4 w-4 text-primary transition-all duration-200" />
              ) : (
                <FolderIcon className="h-4 w-4 text-muted-foreground transition-all duration-200" />
              )}
              <span className={`
                truncate font-medium transition-all duration-200
                ${isOpen ? 'text-foreground' : 'text-muted-foreground'}
                ${isHovered ? 'translate-x-1' : ''}
              `}>
                {item.label}
              </span>
            </div>
            
            {/* Folder indicator */}
            <div className={`
              absolute right-2 h-1.5 w-1.5 rounded-full transition-all duration-200
              ${isOpen ? 'bg-primary scale-100' : 'bg-muted-foreground/50 scale-75'}
            `} />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left-1">
          <SidebarMenuSub className={`
            space-y-1 ml-2 border-l border-border/30 pl-2 
            animate-in fade-in-50 slide-in-from-left-2 duration-300
          `}>
            {item.children?.map((child, index) => (
              <Tree
                key={index}
                item={child}
                selectedValue={selectedValue}
                onSelect={onSelect}
                parentPath={currentPath}
                level={level + 1}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};
