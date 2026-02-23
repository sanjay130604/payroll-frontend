import React from "react";
import { CreditCard } from "lucide-react";
import { InputField } from "./ProfileFields";

export default function BankIdentitySection({ form, onChange, edit }) {
    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <CreditCard className="text-emerald-500" size={20} />
                Banking & Identity
            </h3>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-5">
                <InputField k="bank name" l="Bank Name" value={form["bank name"]} onChange={onChange} edit={edit} />
                <InputField k="account number" l="Account Number" value={form["account number"]} onChange={onChange} edit={edit} />
                <InputField k="pf no" l="PF Number" value={form["pf no"]} onChange={onChange} edit={edit} />
                <InputField k="pan card" l="PAN Card" value={form["pan card"]} onChange={onChange} edit={edit} />
                <InputField k="aadhaar card" l="Aadhaar Card" value={form["aadhaar card"]} onChange={onChange} edit={edit} />
            </div>
        </section>
    );
}
