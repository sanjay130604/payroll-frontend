import React from "react";
import { MapPin } from "lucide-react";
import { InputField, SelectField, ViewField } from "./ProfileFields";
import { COUNTRIES, STATES_BY_COUNTRY } from "./ProfileConstants";

export default function AddressDetailsSection({ form, onChange, edit }) {
    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <MapPin className="text-red-500" size={20} />
                Address Details
            </h3>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="md:col-span-2">
                    <InputField k="current address" l="Current Address" value={form["current address"]} onChange={onChange} edit={edit} />
                </div>
                <div className="md:col-span-2">
                    <InputField k="permanent address" l="Permanent Address" value={form["permanent address"]} onChange={onChange} edit={edit} />
                </div>
                <InputField k="city" l="City" value={form.city} onChange={onChange} edit={edit} />

                <SelectField k="country" l="Country" value={form.country} options={COUNTRIES} onChange={onChange} edit={edit} />

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1">State</label>
                    {edit ? (
                        <div className="relative mt-1">
                            <select
                                value={form.state || ""}
                                onChange={e => onChange("state", e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 appearance-none bg-white"
                                disabled={!form.country}
                            >
                                <option value="">Select State</option>
                                {(STATES_BY_COUNTRY[form.country] || []).map(s =>
                                    <option key={s} value={s}>{s}</option>
                                )}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <span className="text-[10px]">▼</span>
                            </div>
                        </div>
                    ) : <ViewField v={form.state} />}
                </div>

                <InputField k="pincode" l="Pincode" value={form.pincode} onChange={onChange} edit={edit} />
            </div>
        </section>
    );
}
