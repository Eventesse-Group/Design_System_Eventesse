import { useMemo, useState } from "react";
import { participants, sortRows, type EditableKey, type ParticipantProfile, type ParticipantRow, type ParticipantStatus, type SortDirection, type SortKey } from "./data";

export function useTablePrototype() {
  const [records, setRecords] = useState<ParticipantRow[]>(participants);
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<Set<ParticipantStatus>>(new Set());
  const [profiles, setProfiles] = useState<Set<ParticipantProfile>>(new Set());
  const [destinations, setDestinations] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    const filtered = records.filter((row) => {
      const matchesQuery = !normalized || [row.name, row.code, row.profile, row.destination].some((value) => value.toLocaleLowerCase("pt-BR").includes(normalized));
      const matchesStatus = statuses.size === 0 || statuses.has(row.status);
      const matchesProfile = profiles.size === 0 || profiles.has(row.profile);
      const matchesDestination = destinations.size === 0 || destinations.has(row.destination);
      return matchesQuery && matchesStatus && matchesProfile && matchesDestination;
    });
    return sortRows(filtered, sortKey, sortDirection);
  }, [destinations, profiles, query, records, sortDirection, sortKey, statuses]);

  function onSort(key: SortKey) {
    if (key === sortKey) setSortDirection((current) => current === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  function setSort(key: SortKey, direction: SortDirection) {
    setSortKey(key);
    setSortDirection(direction);
  }

  function toggleStatus(status: ParticipantStatus) {
    setStatuses((current) => {
      const next = new Set(current);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  function clearFilters() {
    setQuery("");
    setStatuses(new Set());
    setProfiles(new Set());
    setDestinations(new Set());
  }

  function toggleProfile(profile: ParticipantProfile) {
    setProfiles((current) => {
      const next = new Set(current);
      if (next.has(profile)) next.delete(profile);
      else next.add(profile);
      return next;
    });
  }

  function toggleDestination(destination: string) {
    setDestinations((current) => {
      const next = new Set(current);
      if (next.has(destination)) next.delete(destination);
      else next.add(destination);
      return next;
    });
  }

  function updateCell<K extends EditableKey>(id: string, key: K, value: ParticipantRow[K]) {
    setRecords((current) => current.map((row) => row.id === id ? { ...row, [key]: value } : row));
  }

  function bulkUpdate<K extends EditableKey>(ids: Set<string>, key: K, value: ParticipantRow[K]) {
    if (ids.size === 0) return;
    setRecords((current) => current.map((row) => ids.has(row.id) ? { ...row, [key]: value } : row));
  }

  const filterCount = statuses.size + profiles.size + destinations.size;

  return { query, setQuery, statuses, setStatuses, toggleStatus, profiles, setProfiles, toggleProfile, destinations, setDestinations, toggleDestination, filterCount, clearFilters, rows, sortKey, sortDirection, onSort, setSort, selected, setSelected, updateCell, bulkUpdate };
}
