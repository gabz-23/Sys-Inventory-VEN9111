import { TabsContent } from '@/components/ui/tabs';
import { SearchAccessory } from '@/components/form/accessory/SearchAccessory';

export const AccessoryTab = ({ form, computer }) => {
    return (
        <TabsContent value="accessories" className="space-y-6 mt-4">
            <SearchAccessory form={form} computer={computer} desk={undefined} />
        </TabsContent>
    );
};
