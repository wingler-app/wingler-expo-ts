import { Text } from 'react-native';

interface MenuSectionTitleProps {
  title: string;
}

const MenuSectionTitle = ({ title }: MenuSectionTitleProps) => (
  <Text className="mb-2 ml-5 mt-8 font-bold uppercase text-primary-dark">
    {title}
  </Text>
);

export default MenuSectionTitle;
