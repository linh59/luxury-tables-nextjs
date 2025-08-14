export const QueryKeys = {
    STORES: 'stores',
    TABLES: 'tables',
    GROUPS: 'groups',
};
 

export const QueryKeyStores = {
    STORES: (stores?: string, status?: string, end_date?: string, start_date?: string, page_no?: number, page_size?: number, sort_by?: string, sort_dir?: string) => [
        QueryKeys.STORES,
        stores,
        status,
        end_date,
        start_date,
        page_no ?? 1,
        page_size,
        sort_by ?? 'create_date',
        sort_dir ?? 'desc',
    ],
};

export const QueryKeyTables = {
    TABLES: (searchTerm: string, status: string, end_date?: string, start_date?: string, page_no?: number, page_size?: number, sort_by?: string, sort_dir?: 'asc' | 'desc') => [
        QueryKeys.TABLES,
        searchTerm,
        status,
        end_date,
        start_date,
        page_no,
        page_size,
        sort_by ?? 'create_date',
        sort_dir ?? 'desc',
    ],
};

export const QueryKeyGroups = {
    GROUPS: (searchTerm: string, status: string, end_date?: string, start_date?: string, page_no?: number, page_size?: number, sort_by?: string, sort_dir?: 'asc' | 'desc') => [
        QueryKeys.GROUPS,
        searchTerm,
        status,
        end_date,
        start_date,
        page_no,
        page_size,
        sort_by ?? 'create_date',
        sort_dir ?? 'desc',
    ],
};

// Add other query keys as needed
export const QueryKeyConstants = {
    ...QueryKeys,
    ...QueryKeyStores,
    ...QueryKeyTables,
    ...QueryKeyGroups,
};

// Usage example:
// const queryKey = QueryKey.STORES('search', 'active', '2023-10-01', '2023-10-31', 1, 50, 'create_date', 'desc');
export default QueryKeyConstants;    