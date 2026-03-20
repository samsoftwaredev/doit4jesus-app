import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import type {
  AdminFilters,
  DateRangePreset,
  PlatformFilter,
  UserSegment,
} from '@/interfaces/kpi';

interface FilterBarProps {
  filters: AdminFilters;
  onChange: (filters: AdminFilters) => void;
}

const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  const set = <K extends keyof AdminFilters>(key: K, value: AdminFilters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Date Range</InputLabel>
        <Select
          value={filters.dateRange}
          label="Date Range"
          onChange={(e) => set('dateRange', e.target.value as DateRangePreset)}
        >
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="7d">Last 7 days</MenuItem>
          <MenuItem value="30d">Last 30 days</MenuItem>
          <MenuItem value="90d">Last 90 days</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Platform</InputLabel>
        <Select
          value={filters.platform}
          label="Platform"
          onChange={(e) => set('platform', e.target.value as PlatformFilter)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="web">Web</MenuItem>
          <MenuItem value="ios">iOS</MenuItem>
          <MenuItem value="android">Android</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Segment</InputLabel>
        <Select
          value={filters.segment}
          label="Segment"
          onChange={(e) => set('segment', e.target.value as UserSegment)}
        >
          <MenuItem value="all">All Users</MenuItem>
          <MenuItem value="new">New</MenuItem>
          <MenuItem value="returning">Returning</MenuItem>
          <MenuItem value="power">Power Users</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterBar;
