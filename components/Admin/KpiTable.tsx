import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const Wrapper = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}));

interface Column {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  format?: (value: any) => string;
}

interface KpiTableProps {
  title: string;
  columns: Column[];
  rows: Record<string, any>[];
  loading?: boolean;
  pageSize?: number;
}

const KpiTable = ({
  title,
  columns,
  rows,
  loading,
  pageSize = 10,
}: KpiTableProps) => {
  const [page, setPage] = useState(0);
  const paged = rows.slice(page * pageSize, (page + 1) * pageSize);

  if (loading) {
    return (
      <Wrapper p={2.5}>
        <Skeleton width="40%" height={24} sx={{ mb: 2 }} />
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height={36} sx={{ mb: 0.5 }} />
        ))}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Box px={2.5} pt={2} pb={1}>
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align ?? 'left'}>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    {col.label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" color="text.secondary" py={3}>
                    No data available.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row, idx) => (
                <TableRow key={idx} hover>
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align ?? 'left'}>
                      {col.format
                        ? col.format(row[col.key])
                        : (row[col.key] ?? '—')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {rows.length > pageSize && (
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={pageSize}
          rowsPerPageOptions={[pageSize]}
        />
      )}
    </Wrapper>
  );
};

export default KpiTable;
