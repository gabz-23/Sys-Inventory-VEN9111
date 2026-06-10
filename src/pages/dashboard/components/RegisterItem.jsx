import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';

export const RegisterItem = () => {
    return (
        <Item>
            <ItemContent>
                <ItemTitle>Default Variant</ItemTitle>
                <ItemDescription>Standard styling with subtle background and borders.</ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button variant="outline" size="sm">
                    Open
                </Button>
            </ItemActions>
        </Item>
    );
};
