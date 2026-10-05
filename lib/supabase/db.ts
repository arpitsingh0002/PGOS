import { createClient } from './client';
import {
  Property,
  Building,
  Room,
  Bed,
  Tenant,
  Payment,
  Expense,
  Complaint,
  Staff,
  Task,
  Notice,
  MessMenu,
  PropertyFeatures,
} from '@/types/database';

/**
 * Checks whether Supabase is configured with non-placeholder credentials
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    anonKey &&
    !url.includes('placeholder') &&
    !anonKey.includes('placeholder')
  );
}

/**
 * Generates a valid v4 UUID or converts existing id to valid UUID format
 */
export function ensureUUID(id?: string): string {
  if (!id) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // Already a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    return id;
  }

  // Deterministically map short IDs (e.g. prop-1 -> 00000000-0000-0000-0000-000000000001)
  const numericMatch = id.match(/\d+/);
  if (numericMatch) {
    const num = parseInt(numericMatch[0], 10);
    const hex = num.toString(16).padStart(12, '0');
    return `00000000-0000-4000-8000-${hex}`;
  }

  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return '00000000-0000-4000-8000-000000000001';
}

// -------------------------------------------------------------
// READ OPERATIONS (FETCH ALL TABLES)
// -------------------------------------------------------------

export async function fetchLiveDatabaseState() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = createClient();

  try {
    const [
      propsRes,
      bldsRes,
      roomsRes,
      bedsRes,
      tenantsRes,
      paymentsRes,
      expensesRes,
      complaintsRes,
      staffRes,
      tasksRes,
      noticesRes,
      menusRes,
      featuresRes,
    ] = await Promise.all([
      supabase.from('properties').select('*').order('created_at', { ascending: false }),
      supabase.from('buildings').select('*'),
      supabase.from('rooms').select('*'),
      supabase.from('beds').select('*'),
      supabase.from('tenants').select('*').order('created_at', { ascending: false }),
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
      supabase.from('expenses').select('*').order('created_at', { ascending: false }),
      supabase.from('complaints').select('*').order('created_at', { ascending: false }),
      supabase.from('staff').select('*'),
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('notices').select('*').order('created_at', { ascending: false }),
      supabase.from('mess_menus').select('*'),
      supabase.from('property_features').select('*'),
    ]);

    // Check if any critical query errored due to RLS or connectivity
    if (propsRes.error && propsRes.error.code !== 'PGRST116') {
      console.warn('[Supabase DB] Error reading properties:', propsRes.error.message);
      return null;
    }

    // Convert feature array to map keyed by property_id
    const featuresMap: Record<string, PropertyFeatures> = {};
    if (featuresRes.data) {
      featuresRes.data.forEach((feat: any) => {
        featuresMap[feat.property_id] = {
          id: feat.id,
          property_id: feat.property_id,
          mess_enabled: feat.mess_enabled ?? true,
          electricity_billing_enabled: feat.electricity_billing_enabled ?? true,
          staff_management_enabled: feat.staff_management_enabled ?? true,
          biometric_sync_enabled: feat.biometric_sync_enabled ?? false,
          visitor_qr_enabled: feat.visitor_qr_enabled ?? false,
          whatsapp_reminders_enabled: feat.whatsapp_reminders_enabled ?? true,
        };
      });
    }

    return {
      properties: (propsRes.data as Property[]) || [],
      buildings: (bldsRes.data as Building[]) || [],
      rooms: (roomsRes.data as Room[]) || [],
      beds: (bedsRes.data as Bed[]) || [],
      tenants: (tenantsRes.data as Tenant[]) || [],
      payments: (paymentsRes.data as Payment[]) || [],
      expenses: (expensesRes.data as Expense[]) || [],
      complaints: (complaintsRes.data as Complaint[]) || [],
      staff: (staffRes.data as Staff[]) || [],
      tasks: (tasksRes.data as Task[]) || [],
      notices: (noticesRes.data as Notice[]) || [],
      messMenus: (menusRes.data as MessMenu[]) || [],
      featureFlags: featuresMap,
      hasData: Boolean(propsRes.data && propsRes.data.length > 0),
    };
  } catch (err) {
    console.error('[Supabase DB] Exception fetching live state:', err);
    return null;
  }
}

// -------------------------------------------------------------
// WRITE OPERATIONS (MUTATIONS)
// -------------------------------------------------------------

export async function insertPropertyDB(prop: Property): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const { error } = await supabase.from('properties').insert({
      id: ensureUUID(prop.id),
      owner_id: ensureUUID(prop.owner_id),
      name: prop.name,
      address: prop.address,
      city: prop.city,
      state: prop.state || 'Karnataka',
      pincode: prop.pincode || '560001',
      contact_phone: prop.contact_phone,
      contact_email: prop.contact_email,
      cover_image: prop.cover_image,
      status: prop.status || 'active',
      created_at: prop.created_at || new Date().toISOString(),
    });
    if (error) {
      console.warn('[Supabase DB] insertPropertyDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] insertPropertyDB failed:', err);
    return false;
  }
}

export async function insertBuildingDB(bld: Building): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const { error } = await supabase.from('buildings').insert({
      id: ensureUUID(bld.id),
      property_id: ensureUUID(bld.property_id),
      name: bld.name,
      floors_count: bld.floors_count || 1,
      has_mess: bld.has_mess ?? true,
      description: bld.description || '',
      created_at: bld.created_at || new Date().toISOString(),
    });
    if (error) {
      console.warn('[Supabase DB] insertBuildingDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] insertBuildingDB failed:', err);
    return false;
  }
}

export async function insertRoomDB(room: Room): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const { error } = await supabase.from('rooms').insert({
      id: ensureUUID(room.id),
      property_id: ensureUUID(room.property_id),
      building_id: ensureUUID(room.building_id),
      room_number: room.room_number,
      floor: room.floor || 1,
      sharing_type: room.sharing_type || 'double',
      total_beds: room.total_beds || 2,
      base_rent: room.base_rent || 7500,
      has_attached_bathroom: room.has_attached_bathroom ?? true,
      has_balcony: room.has_balcony ?? false,
      has_ac: room.has_ac ?? false,
      created_at: room.created_at || new Date().toISOString(),
    });
    if (error) {
      console.warn('[Supabase DB] insertRoomDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] insertRoomDB failed:', err);
    return false;
  }
}

export async function updateBedStatusDB(bedId: string, status: Bed['status']): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const { error } = await supabase
      .from('beds')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', ensureUUID(bedId));
    if (error) {
      console.warn('[Supabase DB] updateBedStatusDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] updateBedStatusDB failed:', err);
    return false;
  }
}

export async function insertTenantDB(tenant: Tenant): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const { error } = await supabase.from('tenants').insert({
      id: ensureUUID(tenant.id),
      property_id: ensureUUID(tenant.property_id),
      building_id: ensureUUID(tenant.building_id),
      room_id: ensureUUID(tenant.room_id),
      bed_id: tenant.bed_id ? ensureUUID(tenant.bed_id) : null,
      full_name: tenant.full_name,
      phone: tenant.phone,
      email: tenant.email,
      id_proof_type: tenant.id_proof_type || 'Aadhaar',
      id_proof_number: tenant.id_proof_number,
      emergency_contact_name: tenant.emergency_contact_name,
      emergency_contact_phone: tenant.emergency_contact_phone,
      joining_date: tenant.joining_date || new Date().toISOString().split('T')[0],
      monthly_rent: tenant.monthly_rent,
      security_deposit: tenant.security_deposit || 0,
      agreement_status: tenant.agreement_status || 'signed',
      status: tenant.status || 'active',
      created_at: tenant.created_at || new Date().toISOString(),
    });
    if (error) {
      console.warn('[Supabase DB] insertTenantDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] insertTenantDB failed:', err);
    return false;
  }
}

export async function checkoutTenantDB(tenantId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const { error } = await supabase
      .from('tenants')
      .update({
        status: 'checked_out',
        check_out_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      })
      .eq('id', ensureUUID(tenantId));
    if (error) {
      console.warn('[Supabase DB] checkoutTenantDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] checkoutTenantDB failed:', err);
    return false;
  }
}

export async function insertPaymentDB(pay: Payment): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const { error } = await supabase.from('payments').insert({
      id: ensureUUID(pay.id),
      property_id: ensureUUID(pay.property_id),
      tenant_id: ensureUUID(pay.tenant_id),
      amount: pay.amount,
      payment_type: pay.payment_type || 'rent',
      for_month: pay.for_month,
      payment_date: pay.payment_date || new Date().toISOString().split('T')[0],
      status: pay.status || 'paid',
      payment_mode: pay.payment_mode || 'UPI',
      transaction_ref: pay.transaction_ref,
      receipt_number: pay.receipt_number,
      notes: pay.notes,
      created_at: pay.created_at || new Date().toISOString(),
    });
    if (error) {
      console.warn('[Supabase DB] insertPaymentDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] insertPaymentDB failed:', err);
    return false;
  }
}

export async function insertExpenseDB(exp: Expense): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const { error } = await supabase.from('expenses').insert({
      id: ensureUUID(exp.id),
      property_id: ensureUUID(exp.property_id),
      building_id: exp.building_id ? ensureUUID(exp.building_id) : null,
      category: exp.category,
      amount: exp.amount,
      expense_date: exp.expense_date || new Date().toISOString().split('T')[0],
      description: exp.description,
      vendor_name: exp.vendor_name,
      receipt_url: exp.receipt_url,
      created_at: exp.created_at || new Date().toISOString(),
    });
    if (error) {
      console.warn('[Supabase DB] insertExpenseDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] insertExpenseDB failed:', err);
    return false;
  }
}

export async function insertComplaintDB(cmp: Complaint): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const { error } = await supabase.from('complaints').insert({
      id: ensureUUID(cmp.id),
      property_id: ensureUUID(cmp.property_id),
      tenant_id: ensureUUID(cmp.tenant_id),
      title: cmp.title,
      description: cmp.description,
      category: cmp.category || 'Plumbing',
      priority: cmp.priority || 'medium',
      status: cmp.status || 'new',
      cost: cmp.cost || 0,
      resolution_notes: cmp.resolution_notes,
      created_at: cmp.created_at || new Date().toISOString(),
    });
    if (error) {
      console.warn('[Supabase DB] insertComplaintDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] insertComplaintDB failed:', err);
    return false;
  }
}

export async function updateComplaintDB(
  id: string,
  status: Complaint['status'],
  resolutionNotes?: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const updatePayload: any = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (resolutionNotes) updatePayload.resolution_notes = resolutionNotes;
    if (status === 'resolved') updatePayload.resolved_at = new Date().toISOString();

    const { error } = await supabase
      .from('complaints')
      .update(updatePayload)
      .eq('id', ensureUUID(id));
    if (error) {
      console.warn('[Supabase DB] updateComplaintDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] updateComplaintDB failed:', err);
    return false;
  }
}

export async function insertStaffDB(member: Staff): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const { error } = await supabase.from('staff').insert({
      id: ensureUUID(member.id),
      property_id: ensureUUID(member.property_id),
      name: member.name,
      role: member.role,
      phone: member.phone,
      salary: member.salary || 0,
      joining_date: member.joining_date || new Date().toISOString().split('T')[0],
      status: member.status || 'active',
      created_at: new Date().toISOString(),
    });
    if (error) {
      console.warn('[Supabase DB] insertStaffDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] insertStaffDB failed:', err);
    return false;
  }
}

export async function insertTaskDB(task: Task): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const { error } = await supabase.from('tasks').insert({
      id: ensureUUID(task.id),
      property_id: ensureUUID(task.property_id),
      assigned_to: task.assigned_to ? ensureUUID(task.assigned_to) : null,
      title: task.title,
      description: task.description,
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      due_date: task.due_date,
      created_at: task.created_at || new Date().toISOString(),
    });
    if (error) {
      console.warn('[Supabase DB] insertTaskDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] insertTaskDB failed:', err);
    return false;
  }
}

export async function updateTaskStatusDB(id: string, status: Task['status']): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', ensureUUID(id));
    if (error) {
      console.warn('[Supabase DB] updateTaskStatusDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] updateTaskStatusDB failed:', err);
    return false;
  }
}

export async function insertNoticeDB(notice: Notice): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const { error } = await supabase.from('notices').insert({
      id: ensureUUID(notice.id),
      property_id: ensureUUID(notice.property_id),
      title: notice.title,
      content: notice.content,
      target: notice.target || 'all',
      is_urgent: notice.is_urgent ?? false,
      created_at: notice.created_at || new Date().toISOString(),
    });
    if (error) {
      console.warn('[Supabase DB] insertNoticeDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] insertNoticeDB failed:', err);
    return false;
  }
}

export async function updateFeatureFlagDB(
  propertyId: string,
  feature: keyof PropertyFeatures,
  val: boolean
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = createClient();
  try {
    const propUUID = ensureUUID(propertyId);
    const { error } = await supabase.from('property_features').upsert({
      property_id: propUUID,
      [feature]: val,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.warn('[Supabase DB] updateFeatureFlagDB warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DB] updateFeatureFlagDB failed:', err);
    return false;
  }
}
