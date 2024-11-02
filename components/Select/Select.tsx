import {
  MenuItem as MenuItemMUI,
  Select as SelectMUI,
  SelectProps,
} from '@mui/material';

type Props = {
  menuItems: {
    value: string;
    name: string;
  }[];
} & Omit<SelectProps<any, any>, 'variant'>;

const Select = ({ menuItems, ...props }: Props) => {
  return (
    <SelectMUI {...props}>
      {menuItems.map(({ value, name }) => {
        return (
          <MenuItemMUI key={value} value={value}>
            {name}
          </MenuItemMUI>
        );
      })}
    </SelectMUI>
  );
};

export default Select;
