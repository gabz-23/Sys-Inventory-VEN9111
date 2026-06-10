import { useState, useRef, useEffect } from 'react';
import { ChevronsUpDown, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

export const AccessoryCombobox = ({
    availableAccessories,
    isLoading,
    onAddAccessory,
}) => {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [showTopArrow, setShowTopArrow] = useState(false);
    const [showBottomArrow, setShowBottomArrow] = useState(false);
    const commandListRef = useRef(null);

    const handleSelect = (accessory) => {
        onAddAccessory(accessory);
        setOpen(false);
        setSearchValue('');
    };

    // Verificar si hay scroll disponible y actualizar las flechas
    useEffect(() => {
        if (!open) return;

        const checkScroll = () => {
            // Buscar el elemento CommandList usando el data-slot
            const element =
                commandListRef.current?.querySelector('[data-slot="command-list"]') ||
                document.querySelector('[data-slot="command-list"]');

            if (!element) {
                setShowTopArrow(false);
                setShowBottomArrow(false);
                return;
            }

            const { scrollTop, scrollHeight, clientHeight } = element;
            setShowTopArrow(scrollTop > 5);
            setShowBottomArrow(scrollTop + clientHeight < scrollHeight - 5);
        };

        // Verificar después de un pequeño delay para asegurar que el DOM esté listo
        const timeoutId = setTimeout(checkScroll, 100);

        const element =
            commandListRef.current?.querySelector('[data-slot="command-list"]') ||
            document.querySelector('[data-slot="command-list"]');

        if (element) {
            element.addEventListener('scroll', checkScroll);
            // También verificar cuando cambian los accesorios disponibles
            const observer = new MutationObserver(() => {
                setTimeout(checkScroll, 50);
            });
            observer.observe(element, { childList: true, subtree: true });

            return () => {
                clearTimeout(timeoutId);
                element.removeEventListener('scroll', checkScroll);
                observer.disconnect();
            };
        }

        return () => clearTimeout(timeoutId);
    }, [availableAccessories, open]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full cursor-pointer justify-between font-normal"
                    disabled={isLoading}
                >
                    {isLoading ? 'Cargando...' : 'Buscar accesorio...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0 relative max-h-[200px] overflow-auto"
                align="start"
            >
                <PopoverPrimitive.Arrow className="fill-popover border-popover" />
                <div ref={commandListRef} className="relative">
                    <Command>
                        <CommandInput
                            placeholder="Buscar por código o nombre..."
                            value={searchValue}
                            onValueChange={setSearchValue}
                        />
                        {/* Flecha superior */}
                        {showTopArrow && (
                            <div className="absolute top-10 left-0 right-0 flex justify-center z-20 pointer-events-none">
                                <div className="bg-popover/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-border/50">
                                    <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                                </div>
                            </div>
                        )}
                        <CommandList
                            className={cn(
                                'max-h-[300px] overflow-y-auto',
                                '[&::-webkit-scrollbar]:hidden',
                                '[-ms-overflow-style:none]',
                                '[scrollbar-width:none]'
                            )}
                        >
                            {isLoading ? (
                                <CommandEmpty>Cargando accesorios...</CommandEmpty>
                            ) : (
                                <>
                                    <CommandEmpty>
                                        No se encontraron accesorios
                                    </CommandEmpty>
                                    {availableAccessories.length > 0 && (
                                        <CommandGroup>
                                            {availableAccessories.map((accessory) => (
                                                <CommandItem
                                                    key={accessory.id}
                                                    value={`${accessory.code} ${accessory.type} ${accessory.description || accessory.specs || ''}`}
                                                    onSelect={() => handleSelect(accessory)}
                                                    className="flex items-center justify-between cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <div className="flex flex-col">
                                                            <span className="font-mono text-sm font-medium">
                                                                codigo: {accessory.code}
                                                            </span>
                                                            <span className="text-xs text-gray-600">
                                                                {accessory.type}{accessory.description || accessory.specs ? ` - ${accessory.description || accessory.specs}` : ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Plus className="w-4 h-4 text-blue-600" />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    )}
                                </>
                            )}
                        </CommandList>
                        {/* Flecha inferior */}
                        {showBottomArrow && (
                            <div className="absolute bottom-0 left-0 right-0 flex justify-center z-20 pointer-events-none">
                                <div className="bg-popover/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-border/50">
                                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                </div>
                            </div>
                        )}
                    </Command>
                </div>
            </PopoverContent>
        </Popover>
    );
};
