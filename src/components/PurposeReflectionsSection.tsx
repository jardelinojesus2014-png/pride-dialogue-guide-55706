import { UserPurposeReflections } from './UserPurposeReflections';

interface PurposeReflectionsSectionProps {
  filterUserId?: string;
}

export const PurposeReflectionsSection = ({ filterUserId }: PurposeReflectionsSectionProps) => {
  return <UserPurposeReflections filterUserId={filterUserId} />;
};
