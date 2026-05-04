type RoleMasterListRequest = {
    page: number;
    limit: number;
    search: string | null;
    order_by: string;
    sort_by: string;
}

type RoleMasterListItem = {
    id: string | null;
    user_id: string;
    name: string;
    email: string;
    organizational_emp_id: string | null;
    designation_title: string | null;
    roles: string[];
}

type RoleMasterAddRequest = {
    users: RoleMasterListItem[];
}

type RoleMasterAddResponse = {
    message: string;
}

type RoleMasterUpdateRequest = {
    users: RoleMasterListItem[];
}

type RoleMasterUpdateResponse = {
    message: string;
}

type RoleMasterListResponse = {
    message: string;
    total_count: number;
    page: number;
    users: RoleMasterListItem[];
    data?: RoleMasterListItem[];
}

export type {
    RoleMasterListRequest,
    RoleMasterListItem,
    RoleMasterListResponse,
    RoleMasterAddRequest,
    RoleMasterAddResponse,
    RoleMasterUpdateRequest,
    RoleMasterUpdateResponse
}