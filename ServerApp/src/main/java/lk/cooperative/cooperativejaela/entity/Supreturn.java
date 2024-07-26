package lk.cooperative.cooperativejaela.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Supreturn {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "date")
    private Date date;
    @Basic
    @Column(name = "returnno")
    private String returnno;
    @Basic
    @Column(name = "reason")
    private String reason;
    @Basic
    @Column(name = "grandtotal")
    private BigDecimal grandtotal;
    @OneToMany(mappedBy = "supreturn",cascade = CascadeType.ALL,orphanRemoval = true)
    private Collection<Supreitem> supreitems;
    @ManyToOne
    @JoinColumn(name = "grn_id", referencedColumnName = "id", nullable = false)
    private Grn grn;
    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id", nullable = false)
    private Supplier supplier;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getReturnno() {
        return returnno;
    }

    public void setReturnno(String returnno) {
        this.returnno = returnno;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public BigDecimal getGrandtotal() {
        return grandtotal;
    }

    public void setGrandtotal(BigDecimal grandtotal) {
        this.grandtotal = grandtotal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Supreturn supreturn = (Supreturn) o;
        return id == supreturn.id && Objects.equals(date, supreturn.date) && Objects.equals(returnno, supreturn.returnno) && Objects.equals(reason, supreturn.reason) && Objects.equals(grandtotal, supreturn.grandtotal);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, date, returnno, reason, grandtotal);
    }

    public Collection<Supreitem> getSupreitems() {
        return supreitems;
    }

    public void setSupreitems(Collection<Supreitem> supreitems) {
        this.supreitems = supreitems;
    }

    public Grn getGrn() {
        return grn;
    }

    public void setGrn(Grn grn) {
        this.grn = grn;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}
