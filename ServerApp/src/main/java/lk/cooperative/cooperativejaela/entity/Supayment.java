package lk.cooperative.cooperativejaela.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
public class Supayment {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "suppayno")
    private String suppayno;
    @Basic
    @Column(name = "grandtotal")
    private BigDecimal grandtotal;
    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id", nullable = false)
    private Supplier supplier;
    @ManyToOne
    @JoinColumn(name = "grn_id", referencedColumnName = "id", nullable = false)
    private Grn grn;
    @ManyToOne
    @JoinColumn(name = "ptype_id", referencedColumnName = "id", nullable = false)
    private Ptype ptype;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @ManyToOne
    @JoinColumn(name = "pstatus_id", referencedColumnName = "id", nullable = false)
    private Pstatus pstatus;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSuppayno() {
        return suppayno;
    }

    public void setSuppayno(String suppayno) {
        this.suppayno = suppayno;
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
        Supayment supayment = (Supayment) o;
        return id == supayment.id && Objects.equals(suppayno, supayment.suppayno) && Objects.equals(grandtotal, supayment.grandtotal);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, suppayno, grandtotal);
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Grn getGrn() {
        return grn;
    }

    public void setGrn(Grn grn) {
        this.grn = grn;
    }

    public Ptype getPtype() {
        return ptype;
    }

    public void setPtype(Ptype ptype) {
        this.ptype = ptype;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Pstatus getPstatus() {
        return pstatus;
    }

    public void setPstatus(Pstatus pstatus) {
        this.pstatus = pstatus;
    }
}
